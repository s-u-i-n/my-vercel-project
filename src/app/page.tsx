import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function HomePage() {
  // 식당 목록 데이터 가져오기
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">어떤 음식을 드시고 싶으신가요?</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <Link 
              key={restaurant.id} 
              href={`/restaurant/${restaurant.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow block"
            >
              <div 
                className="w-full h-48 bg-cover bg-center bg-gray-200"
                style={{ backgroundImage: `url(${restaurant.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'})` }}
              />
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-1">{restaurant.name}</h2>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{restaurant.description}</p>
                <p className="text-sm font-medium text-[#ea580c]">메뉴 보기 →</p>
              </div>
            </Link>
          ))}
        </div>
        
        {restaurants.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">등록된 식당이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
