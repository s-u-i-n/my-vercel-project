import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import CartItemCard from "@/components/CartItemCard"

export default async function CartPage() {
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

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.menu.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">장바구니</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 mb-4">장바구니가 비어있습니다.</p>
            <Link href="/" className="inline-block bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              식당 둘러보기
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </ul>
            <div className="bg-gray-50 p-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium text-gray-700">총 결제 금액</span>
                <span className="text-2xl font-extrabold text-gray-900">{totalPrice.toLocaleString()}원</span>
              </div>
              <button 
                className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                disabled
              >
                주문하기 (구현 예정)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
