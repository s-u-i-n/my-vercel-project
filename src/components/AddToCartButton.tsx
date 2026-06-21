"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddToCartButton({ menuId }: { menuId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuId })
      })

      if (res.status === 401) {
        alert("로그인이 필요한 기능입니다. 로그인 페이지로 이동합니다.")
        router.push("/login")
        return
      }

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "장바구니 담기 실패")
      }

      alert("장바구니에 담았습니다!")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleAddToCart}
      disabled={loading}
      className={`mt-3 w-full py-2 rounded-lg font-medium text-sm transition-colors ${
        loading 
          ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
          : "bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200"
      }`}
    >
      {loading ? "담는 중..." : "장바구니 담기"}
    </button>
  )
}
