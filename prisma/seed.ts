import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.cartItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.menu.deleteMany()
  await prisma.restaurant.deleteMany()

  const basicOptions = [
    { name: "음료 추가", choices: ["선택 안함", "콜라", "사이다"] }
  ]

  const restaurants = [
    // 분식
    { name: "동대문 엽기떡볶이", category: "분식", desc: "스트레스 풀리는 매운맛", img: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=1000&auto=format&fit=crop" },
    { name: "신전떡볶이", category: "분식", desc: "후추맛 가득한 매콤달콤 떡볶이", img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=400&auto=format&fit=crop" },
    { name: "죠스떡볶이", category: "분식", desc: "매콤달콤한 소스와 바삭한 튀김", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&auto=format&fit=crop" },
    
    // 패스트푸드
    { name: "수제 버거 하우스", category: "패스트푸드", desc: "100% 쇠고기 패티로 만든 수제 버거", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop" },
    { name: "맥도날드", category: "패스트푸드", desc: "언제나 맛있는 빅맥과 감자튀김", img: "https://images.unsplash.com/photo-1594212691516-ac41df8734e5?q=80&w=400&auto=format&fit=crop" },
    { name: "버거킹", category: "패스트푸드", desc: "불맛 가득한 와퍼의 진수", img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=400&auto=format&fit=crop" },
    
    // 일식
    { name: "신선한 초밥마을", category: "일식", desc: "매일 아침 들어오는 신선한 생선", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop" },
    { name: "히노아지", category: "일식", desc: "진한 국물의 돈코츠 라멘", img: "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=400&auto=format&fit=crop" },
    { name: "홍대돈부리", category: "일식", desc: "바삭한 돈까스가 올라간 가츠동", img: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=400&auto=format&fit=crop" },
    
    // 양식
    { name: "아웃백 스테이크하우스", category: "양식", desc: "정통 호주식 스테이크와 파스타", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=600&auto=format&fit=crop" },
    { name: "롤링파스타", category: "양식", desc: "가성비 최고의 맛있는 파스타", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=400&auto=format&fit=crop" },
    { name: "매드포갈릭", category: "양식", desc: "마늘을 테마로 한 독특한 이탈리안", img: "https://images.unsplash.com/photo-1579684947550-22e945225d9a?q=80&w=400&auto=format&fit=crop" },

    // 중식
    { name: "홍콩반점", category: "중식", desc: "불맛 가득 짬뽕과 바삭한 탕수육", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop" },
    { name: "마라공방", category: "중식", desc: "얼얼하고 매콤한 리얼 마라탕", img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=400&auto=format&fit=crop" },
    { name: "북경반점", category: "중식", desc: "전통 짜장면과 군만두의 조화", img: "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=400&auto=format&fit=crop" },

    // 한식
    { name: "원할머니보쌈", category: "한식", desc: "부드러운 고기와 매콤달콤 무김치", img: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=600&auto=format&fit=crop" },
    { name: "본죽", category: "한식", desc: "정성으로 끓인 따뜻한 영양죽", img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=400&auto=format&fit=crop" },
    { name: "김밥천국", category: "한식", desc: "언제나 든든한 종합 분식 한식당", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&auto=format&fit=crop" },
  ]

  for (const r of restaurants) {
    await prisma.restaurant.create({
      data: {
        name: r.name,
        category: r.category,
        description: r.desc,
        imageUrl: r.img,
        menus: {
          create: [
            { name: "대표 메뉴 1", price: 15000, description: "최고의 인기 메뉴", imageUrl: r.img, options: basicOptions },
            { name: "대표 메뉴 2", price: 12000, description: "꾸준히 사랑받는 스테디셀러", imageUrl: r.img, options: basicOptions }
          ]
        }
      }
    })
  }

  console.log("Seeding finished with categories.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
