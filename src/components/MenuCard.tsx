"use client"

import { useState } from "react"
import MenuOptionModal from "./MenuOptionModal"

type MenuCardProps = {
  menu: any
}

export default function MenuCard({ menu }: MenuCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer flex justify-between items-start"
      >
        <div className="flex-1 pr-4">
          <h3 className="font-bold text-gray-900 text-[15px] mb-1">{menu.name}</h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-2">{menu.description}</p>
          <p className="text-red-500 font-bold text-sm mb-3">{menu.price.toLocaleString()}원</p>
          <button className="bg-[#fff7ed] text-red-500 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-orange-100 transition-colors w-max">
            메뉴 담기
          </button>
        </div>
        <div 
          className="w-24 h-24 bg-cover bg-center rounded-lg flex-shrink-0 border border-gray-100"
          style={{ backgroundImage: `url(${menu.imageUrl || 'https://via.placeholder.com/150?text=No+Image'})` }}
        />
      </div>

      {isModalOpen && (
        <MenuOptionModal menu={menu} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  )
}
