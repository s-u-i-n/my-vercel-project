"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type OptionGroup = {
  name: string
  choices: string[]
}

type Menu = {
  id: string
  name: string
  price: number
  description: string | null
  options: any
}

export default function MenuOptionModal({ menu, onClose }: { menu: Menu, onClose: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const optionGroups: OptionGroup[] = menu.options ? (menu.options as OptionGroup[]) : []
  
  // 기본 선택값 세팅 (첫 번째 옵션)
  const initialOptions = optionGroups.reduce((acc, group) => {
    if (group.choices && group.choices.length > 0) {
      acc[group.name] = group.choices[0]
    }
    return acc
  }, {} as Record<string, string>)
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions)
  const [quantity, setQuantity] = useState(1)

  const handleOptionChange = (groupName: string, choice: string) => {
    setSelectedOptions(prev => ({ ...prev, [groupName]: choice }))
  }

  const addToCart = async (redirectCheckout: boolean) => {
    setLoading(true)
    try {
      // 지정한 수량만큼 장바구니에 담기 위해, API를 한 번만 호출하고 서버에서 처리하거나 여러 번 호출할 수 있습니다.
      // 여기서는 수량 처리 로직을 서버에 구현하지 않았으므로, 루프를 돌며 API를 호출합니다. (단순화된 구현)
      for(let i=0; i<quantity; i++) {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ menuId: menu.id, selectedOptions })
        })

        if (res.status === 401) {
          alert("로그인이 필요한 기능입니다.")
          router.push("/login")
          return
        }
        if (!res.ok) {
          const errMsg = await res.text()
          throw new Error(errMsg || "장바구니 담기에 실패했습니다.")
        }
      }

      if (redirectCheckout) {
        // router.push는 Next.js 최적화로 인해 레이아웃(헤더)을 즉시 새로고침하지 않을 수 있습니다.
        // 강제 이동을 통해 완벽한 서버사이드 렌더링을 유도하여 헤더 숫자를 즉시 갱신합니다.
        window.location.href = "/checkout"
      } else {
        alert("장바구니에 담았습니다!")
        router.refresh()
        onClose()
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{menu.name}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          <div className="text-right mb-6">
            <p className="text-red-500 font-bold text-lg">{(menu.price).toLocaleString()}원</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-100 mb-6 space-y-6">
            {optionGroups.map((group, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-gray-900 text-sm mb-3">{group.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.choices.map((choice, cIdx) => (
                    <label key={cIdx} className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${selectedOptions[group.name] === choice ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name={group.name}
                        value={choice}
                        checked={selectedOptions[group.name] === choice}
                        onChange={() => handleOptionChange(group.name, choice)}
                        className="w-4 h-4 text-red-500 focus:ring-red-500"
                      />
                      <span className="text-gray-700 text-sm font-medium">{choice}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
            <span className="font-bold text-gray-900 text-sm">수량</span>
            <div className="flex items-center gap-4 bg-gray-50 rounded-full px-2 py-1">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full font-bold"
              >
                -
              </button>
              <span className="font-bold text-gray-900 w-4 text-center text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
          <button 
            onClick={() => addToCart(false)}
            disabled={loading}
            className="flex-1 bg-white border border-red-500 text-red-500 font-bold py-3.5 rounded-xl hover:bg-red-50 transition-colors text-sm"
          >
            장바구니 담기
          </button>
          <button 
            onClick={() => addToCart(true)}
            disabled={loading}
            className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-700 transition-colors text-sm flex flex-col items-center justify-center leading-tight"
          >
            <span>바로 주문하기</span>
            <span className="text-xs font-normal opacity-90">{(menu.price * quantity).toLocaleString()}원</span>
          </button>
        </div>
      </div>
    </div>
  )
}
