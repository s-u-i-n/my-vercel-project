import prisma from "@/lib/prisma"
import RestaurantFilter from "@/components/RestaurantFilter"

export default async function HomePage() {
  // 식당 목록 데이터 가져오기
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">어떤 음식을 드시고 싶으신가요?</h1>
        <RestaurantFilter initialRestaurants={restaurants} />
      </div>
    </div>
  )
}
