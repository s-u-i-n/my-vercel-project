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
    const { menuId } = body

    if (!menuId) {
      return new NextResponse("menuId is required", { status: 400 })
    }

    // 장바구니에 이미 동일한 메뉴가 있는지 확인
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_menuId: {
          userId,
          menuId
        }
      }
    })

    if (existingCartItem) {
      // 이미 있다면 수량 증가
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 }
      })
      return NextResponse.json(updatedItem)
    } else {
      // 없다면 새로 생성
      const newItem = await prisma.cartItem.create({
        data: {
          userId,
          menuId,
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
