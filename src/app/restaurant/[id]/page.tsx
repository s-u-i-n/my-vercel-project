import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import MenuCard from "@/components/MenuCard"

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
      <div className="max-w-[1000px] mx-auto px-4 mt-8 mb-12">
        <div 
          className="w-full h-48 sm:h-64 bg-cover bg-center rounded-2xl mb-6 shadow-sm"
          style={{ backgroundImage: `url(${restaurant.imageUrl || 'https://via.placeholder.com/1200x400?text=No+Image'})` }}
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{restaurant.name}</h1>
          <p className="text-gray-500 text-sm">{restaurant.description}</p>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-4 mt-8">메뉴</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurant.menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
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
