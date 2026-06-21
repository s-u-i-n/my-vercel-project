import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import AddToCartButton from "@/components/AddToCartButton"

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: resolvedParams.id },
    include: {
      menus: true
    }
  })

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="w-full h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${restaurant.imageUrl || 'https://via.placeholder.com/1200x400?text=No+Image'})` }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative">
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{restaurant.name}</h1>
          <p className="text-gray-600 text-lg">{restaurant.description}</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">메뉴 목록</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {restaurant.menus.map((menu) => (
            <div key={menu.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex hover:shadow-md transition-shadow">
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{menu.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-2">{menu.description}</p>
                <p className="text-blue-600 font-semibold">{menu.price.toLocaleString()}원</p>
                <AddToCartButton menuId={menu.id} />
              </div>
              <div 
                className="w-32 h-full min-h-[120px] bg-cover bg-center"
                style={{ backgroundImage: `url(${menu.imageUrl || 'https://via.placeholder.com/150?text=No+Image'})` }}
              />
            </div>
          ))}
        </div>
        {restaurant.menus.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500">등록된 메뉴가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
