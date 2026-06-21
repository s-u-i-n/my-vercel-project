import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })
    
    const resolvedParams = await params
    const cartItemId = resolvedParams.id
    const { quantity } = await request.json()

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } })
      return NextResponse.json({ deleted: true })
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Cart update error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })
    
    const resolvedParams = await params
    const cartItemId = resolvedParams.id

    await prisma.cartItem.delete({ where: { id: cartItemId } })
    return NextResponse.json({ deleted: true })
  } catch (error) {
    console.error("Cart delete error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
