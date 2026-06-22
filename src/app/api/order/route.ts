import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })
    
    const userId = (session.user as any).id

    const body = await request.json()
    const { address, phone, requests } = body

    // 1. 장바구니 아이템 가져오기
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        menu: true
      }
    })

    if (cartItems.length === 0) {
      return new NextResponse("Cart is empty", { status: 400 })
    }

    // 2. 식당별로 아이템 그룹화 (여러 식당의 메뉴를 담았을 경우를 대비해 각각의 주문서로 분리)
    const itemsByRestaurant = cartItems.reduce((acc, item) => {
      const restId = item.menu.restaurantId;
      if (!acc[restId]) acc[restId] = [];
      acc[restId].push(item);
      return acc;
    }, {} as Record<string, typeof cartItems>);

    // 3. 식당별 주문(Order) 생성
    for (const [restaurantId, items] of Object.entries(itemsByRestaurant)) {
      const totalPrice = items.reduce((sum, item) => sum + (item.menu.price * item.quantity), 0);

      await prisma.order.create({
        data: {
          userId,
          restaurantId,
          totalPrice,
          status: "PENDING",
          address,
          phone,
          requests,
          orderItems: {
            create: items.map(item => ({
              menu: { connect: { id: item.menuId } },
              quantity: item.quantity,
              price: item.menu.price, // 주문 당시의 가격 스냅샷
              selectedOptions: item.selectedOptions ? (item.selectedOptions as any) : undefined
            }))
          }
        }
      });
    }

    // 4. 주문 완료 후 장바구니 비우기
    await prisma.cartItem.deleteMany({
      where: { userId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Order error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
