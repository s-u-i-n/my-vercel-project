"use client"

import { useState } from "react"
import Link from "next/link"

type Restaurant = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string;
}

export default function RestaurantFilter({ initialRestaurants }: { initialRestaurants: Restaurant[] }) {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")
  
  const categories = ["전체", "분식", "패스트푸드", "일식", "양식", "중식", "한식"]

  // 1차 필터링: 카테고리
  let filteredRestaurants = selectedCategory === "전체" 
    ? initialRestaurants 
    : initialRestaurants.filter(r => r.category === selectedCategory)

  // 2차 필터링: 검색어
  if (searchQuery.trim() !== "") {
    filteredRestaurants = filteredRestaurants.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  return (
    <div>
      {/* 검색창 */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="먹고 싶은 식당이나 메뉴를 검색해보세요! (예: 떡볶이)" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:border-transparent transition-all"
        />
      </div>

      {/* 카테고리 필터 탭 */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-[#ea580c] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 식당 목록 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRestaurants.map((restaurant) => (
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
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-lg font-bold text-gray-900">{restaurant.name}</h2>
                <span className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-md font-medium">{restaurant.category}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{restaurant.description}</p>
              <p className="text-sm font-medium text-[#ea580c]">메뉴 보기 →</p>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredRestaurants.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">해당 카테고리에 등록된 식당이 없습니다.</p>
        </div>
      )}
    </div>
  )
}
