import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import LogoutButton from "./LogoutButton"

export default async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
          🚀 초간단 배달앱
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          {session?.user ? (
            <>
              <span className="text-sm text-gray-700 hidden sm:inline-block">
                <span className="font-semibold text-gray-900">{session.user.name}</span>님 환영합니다!
              </span>
              <Link href="/cart" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                장바구니
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                로그인
              </Link>
              <Link href="/register" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
