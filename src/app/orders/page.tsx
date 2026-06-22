import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/login")
  }

  const userId = (session.user as any).id

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      restaurant: true,
      orderItems: {
        include: {
          menu: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">주문 내역</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">주문 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderDate = new Date(order.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })

              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  {/* 상단 정보 */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">주문일: {orderDate}</p>
                      <p className="text-xs text-gray-500">배달 주소: {order.address || "정보 없음"}</p>
                    </div>
                    <span className="bg-orange-50 text-[#ea580c] text-[10px] font-bold px-2 py-1 rounded-full border border-orange-100">
                      접수 완료
                    </span>
                  </div>

                  <div className="border-t-2 border-gray-900 pt-6">
                    <ul className="space-y-6">
                      {order.orderItems.map((item) => (
                        <li key={item.id} className="flex justify-between items-start border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                          <div>
                            <h3 className="text-[15px] font-bold text-gray-900 mb-1">{item.menu.name}</h3>
                            <p className="text-xs text-gray-500">{order.restaurant.name}</p>
                            {item.selectedOptions && Object.keys(item.selectedOptions as Record<string, string>).length > 0 && (
                              <p className="text-xs text-[#ea580c] mt-1">
                                옵션: {Object.values(item.selectedOptions as Record<string, string>).join(", ")}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-[14px] text-gray-900 mb-1">{(item.price * item.quantity).toLocaleString()}원</p>
                            <p className="text-xs text-gray-500">수량: {item.quantity}개</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t-2 border-gray-900 pt-4 mt-6 text-right">
                    <span className="text-sm font-bold text-gray-700 mr-2">총 결제 금액:</span>
                    <span className="text-lg font-extrabold text-[#ea580c]">{order.totalPrice.toLocaleString()}원</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
