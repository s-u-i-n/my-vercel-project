"use client"
import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
    >
      로그아웃
    </button>
  )
}
