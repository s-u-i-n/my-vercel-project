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
        <div>
          <h3 className="font-bold text-gray-900 text-[15px] mb-1">{menu.name}</h3>
          <p className="text-[#ea580c] font-bold text-sm">{menu.price.toLocaleString()}원</p>
        </div>
        <button className="bg-[#fff7ed] text-[#ea580c] text-xs font-bold px-3 py-1.5 rounded-md hover:bg-orange-100 transition-colors">
          메뉴 담기
        </button>
      </div>

      {isModalOpen && (
        <MenuOptionModal menu={menu} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  )
}
