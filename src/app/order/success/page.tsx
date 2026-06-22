import Link from "next/link"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">주문 완료!</h1>
          <p className="text-gray-500 text-lg">
            맛있는 음식을 곧 배달해 드릴게요.
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <Link 
            href="/" 
            className="block w-full bg-red-500 text-white font-bold text-lg py-3 rounded-xl hover:bg-red-600 transition-colors shadow-sm"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
