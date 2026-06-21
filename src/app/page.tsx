import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function HomePage() {
  // 식당 목록 데이터 가져오기
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">오늘의 추천 식당</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {restaurants.map((restaurant) => (
            <Link 
              key={restaurant.id} 
              href={`/restaurant/${restaurant.id}`}
              className="block group"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div 
                  className="h-48 w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${restaurant.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'})` }}
                />
                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {restaurant.name}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {restaurant.description}
                  </p>
                </div>
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
