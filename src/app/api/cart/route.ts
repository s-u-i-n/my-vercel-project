import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !(session.user as any).id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    const userId = (session.user as any).id
    const body = await request.json()
    const { menuId, selectedOptions } = body

    if (!menuId) {
      return new NextResponse("menuId is required", { status: 400 })
    }

    // 메뉴 정보 가져오기 (어느 식당인지 확인)
    const menuToadd = await prisma.menu.findUnique({
      where: { id: menuId },
      select: { restaurantId: true }
    })

    if (!menuToadd) {
      return new NextResponse("Menu not found", { status: 404 })
    }

    // 장바구니에 담긴 아이템의 식당 확인
    const existingCartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { menu: true }
    })

    if (existingCartItems.length > 0) {
      const firstItemRestaurantId = existingCartItems[0].menu.restaurantId
      if (firstItemRestaurantId !== menuToadd.restaurantId) {
        return new NextResponse("다른 가게의 메뉴가 이미 장바구니에 있습니다. 같은 가게의 메뉴만 담을 수 있습니다.", { status: 400 })
      }
    }

    // 완전히 동일한 옵션을 가진 동일한 메뉴가 있는지 찾기
    const existingItem = existingCartItems.find(item => 
      item.menuId === menuId && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions || null)
    )

    if (existingItem) {
      // 이미 완전히 동일한 아이템이 있다면 수량만 증가
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 }
      })
      return NextResponse.json(updatedItem)
    } else {
      // 없다면 새로 생성
      const newItem = await prisma.cartItem.create({
        data: {
          userId,
          menuId,
          selectedOptions: selectedOptions || null,
          quantity: 1
        }
      })
      return NextResponse.json(newItem)
    }
  } catch (error) {
    console.error("Cart API Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
