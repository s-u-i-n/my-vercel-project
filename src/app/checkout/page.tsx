import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import CheckoutForm from "@/components/CheckoutForm"
import CartItemCard from "@/components/CartItemCard"

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/login")
  }

  const userId = (session.user as any).id

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      menu: {
        include: {
          restaurant: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-[700px] w-full text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4">장바구니가 비어있습니다.</p>
        </div>
      </div>
    )
  }

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.menu.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[700px] mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">장바구니 및 주문하기</h1>
        <div className="border-t-2 border-gray-900 pt-6 mb-6">
          <h2 className="text-[15px] font-bold text-gray-900 mb-4">주문 내역</h2>
          <ul className="mb-6 bg-gray-50/50 rounded-lg p-2">
            {cartItems.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </ul>
        </div>

        <div className="border-t-2 border-gray-900 pt-6 mb-8 flex justify-between items-center">
          <span className="font-bold text-gray-900">총 결제 금액</span>
          <span className="text-xl font-extrabold text-red-500">{totalPrice.toLocaleString()}원</span>
        </div>

        {/* 결제 폼 */}
        <CheckoutForm totalPrice={totalPrice} />

      </div>
    </div>
  )
}
