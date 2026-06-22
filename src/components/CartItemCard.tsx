"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type CartItemProps = {
  item: {
    id: string
    quantity: number
    selectedOptions: any
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
    <li className={`py-5 flex items-center justify-between gap-4 border-b border-gray-100 ${loading ? 'opacity-50' : ''}`}>
      <div className="flex-1">
        <h3 className="text-[15px] font-bold text-gray-900 mb-1">{item.menu.name}</h3>
        <p className="text-xs text-gray-500">{item.menu.restaurant.name}</p>
        {item.selectedOptions && Object.keys(item.selectedOptions as Record<string, string>).length > 0 && (
          <p className="text-xs text-[#ea580c] mt-1">
            옵션: {Object.values(item.selectedOptions as Record<string, string>).join(", ")}
          </p>
        )}
      </div>
      
      {/* 수량 조절 버튼 */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1 w-max border border-gray-100">
        <button 
          onClick={() => updateQuantity(item.quantity - 1)}
          disabled={loading}
          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-black font-bold"
        >
          -
        </button>
        <span className="font-semibold text-gray-900 w-4 text-center text-sm">{item.quantity}</span>
        <button 
          onClick={() => updateQuantity(item.quantity + 1)}
          disabled={loading}
          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-black font-bold"
        >
          +
        </button>
      </div>

      <div className="flex items-center gap-4 min-w-[100px] justify-end">
        <p className="text-[15px] font-bold text-gray-900">
          {(item.menu.price * item.quantity).toLocaleString()}원
        </p>
        <button 
          onClick={() => updateQuantity(0)} 
          disabled={loading}
          className="text-red-400 hover:text-red-600 p-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </li>
  )
}
