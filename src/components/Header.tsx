import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import LogoutButton from "./LogoutButton"
import prisma from "@/lib/prisma"

export default async function Header() {
  const session = await getServerSession(authOptions)
  
  let cartItemCount = 0;
  if (session?.user) {
    const userId = (session.user as any).id
    const result = await prisma.cartItem.aggregate({
      _sum: { quantity: true },
      where: { userId }
    })
    cartItemCount = result._sum.quantity || 0;
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1000px] mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#ea580c] flex items-center gap-2 tracking-tight">
          배달앱
        </Link>
        <nav className="flex items-center gap-4 sm:gap-5">
          {session?.user ? (
            <>
              <span className="text-sm text-gray-500 hidden sm:inline-block">
                {session.user.name || session.user.email}님
              </span>
              <Link href="/checkout" className="relative p-1 text-gray-700 hover:text-[#ea580c] transition-colors flex items-center" title="장바구니">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <Link href="/orders" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                주문내역
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                로그인
              </Link>
              <Link href="/register" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
