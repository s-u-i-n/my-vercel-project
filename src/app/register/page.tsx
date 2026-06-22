"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name })
    })

    if (res.ok) {
      alert("회원가입 성공! 로그인해주세요.")
      router.push("/login")
    } else {
      const errorText = await res.text()
      alert(`회원가입 실패: ${errorText}`)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">이름</label>
            <input 
              type="text" 
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input 
              type="email" 
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input 
              type="password" 
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          >
            가입하기
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          이미 계정이 있으신가요? <a href="/login" className="text-red-500 hover:underline">로그인</a>
        </p>
      </div>
    </div>
  )
}
