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

    // 완전히 동일한 옵션을 가진 동일한 메뉴가 있는지 찾기
    const existingCartItems = await prisma.cartItem.findMany({
      where: {
        userId,
        menuId
      }
    })

    // JSON 객체 비교 (간단한 문자열화 비교)
    const existingItem = existingCartItems.find(item => 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions || null)
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
