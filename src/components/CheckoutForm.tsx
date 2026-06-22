"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutForm({ totalPrice }: { totalPrice: number }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    requests: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        throw new Error("주문 처리에 실패했습니다.")
      }

      router.push("/order/success")
      router.refresh()
    } catch (err: any) {
      alert(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">배달 받으실 주소</label>
        <input 
          type="text" 
          name="address"
          required
          value={formData.address}
          onChange={handleChange}
          placeholder="서울특별시 강남구 테헤란로 123"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors text-sm"
        />
      </div>
      
      <div className="pt-4">
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 text-white font-bold text-sm py-4 rounded-lg hover:bg-orange-700 transition-colors shadow-sm disabled:bg-gray-400"
        >
          {loading ? "결제 중..." : `${totalPrice.toLocaleString()}원 결제하기`}
        </button>
      </div>
    </form>
  )
}
