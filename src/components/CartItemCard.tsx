"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type CartItemProps = {
  item: {
    id: string
    quantity: number
    menu: {
      name: string
      price: number
      imageUrl: string | null
      restaurant: {
        name: string
      }
    }
  }
}

export default function CartItemCard({ item }: CartItemProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const updateQuantity = async (newQuantity: number) => {
    setLoading(true)
    try {
      await fetch(`/api/cart/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity })
      })
      router.refresh() // 서버 데이터를 다시 불러와 수량/금액 갱신
    } catch (err) {
      console.error(err)
      alert("수량 변경에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <li className={`p-6 flex flex-col sm:flex-row sm:items-center gap-4 ${loading ? 'opacity-50' : ''}`}>
      <div 
        className="w-full sm:w-24 h-24 bg-cover bg-center rounded-lg flex-shrink-0"
        style={{ backgroundImage: `url(${item.menu.imageUrl || 'https://via.placeholder.com/150'})` }}
      />
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">{item.menu.restaurant.name}</p>
        <h3 className="text-lg font-bold text-gray-900">{item.menu.name}</h3>
        <p className="text-gray-600 mt-1">{item.menu.price.toLocaleString()}원</p>
      </div>
      
      {/* 수량 조절 버튼 */}
      <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-1 w-max">
        <button 
          onClick={() => updateQuantity(item.quantity - 1)}
          disabled={loading}
          className="text-gray-600 hover:text-black font-bold text-xl px-2"
        >
          -
        </button>
        <span className="font-semibold text-gray-900 w-4 text-center">{item.quantity}</span>
        <button 
          onClick={() => updateQuantity(item.quantity + 1)}
          disabled={loading}
          className="text-gray-600 hover:text-black font-bold text-xl px-2"
        >
          +
        </button>
      </div>

      <div className="text-right sm:w-32">
        <p className="text-xl font-bold text-blue-600">
          {(item.menu.price * item.quantity).toLocaleString()}원
        </p>
      </div>
    </li>
  )
}
