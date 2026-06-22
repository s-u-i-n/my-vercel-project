"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutButton({ disabled = false }: { disabled?: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleOrder = () => {
    // 결제/주소 입력 페이지로 이동
    router.push("/checkout")
  }

  return (
    <button 
      onClick={handleOrder}
      disabled={disabled}
      className={`w-full font-bold text-lg py-4 rounded-xl transition-colors shadow-sm ${
        disabled 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      주문 정보 입력하기
    </button>
  )
}
