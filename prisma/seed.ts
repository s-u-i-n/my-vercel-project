import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 기존 데이터 초기화 (필요하다면)
  await prisma.menu.deleteMany()
  await prisma.restaurant.deleteMany()

  // 식당 데이터 생성
  const rest1 = await prisma.restaurant.create({
    data: {
      name: "맛있는 떡볶이",
      description: "매콤달콤 맛있는 떡볶이 전문점",
      imageUrl: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=600&auto=format&fit=crop",
      menus: {
        create: [
          { name: "치즈 떡볶이", price: 6500, description: "모짜렐라 치즈가 듬뿍 들어간 떡볶이", imageUrl: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=400&auto=format&fit=crop" },
          { name: "모둠 튀김", price: 5000, description: "김말이, 오징어, 고구마 튀김 세트", imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&auto=format&fit=crop" }
        ]
      }
    }
  })

  const rest2 = await prisma.restaurant.create({
    data: {
      name: "수제 버거 하우스",
      description: "100% 쇠고기 패티로 만든 수제 버거",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop",
      menus: {
        create: [
          { name: "클래식 치즈버거", price: 8900, description: "육즙 가득한 패티와 체다 치즈", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop" },
          { name: "베이컨 토마토 버거", price: 10500, description: "바삭한 베이컨과 신선한 토마토", imageUrl: "https://images.unsplash.com/photo-1594212691516-ac41df8734e5?q=80&w=400&auto=format&fit=crop" },
          { name: "감자튀김", price: 3500, description: "바삭하게 튀긴 케이준 감자튀김", imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=400&auto=format&fit=crop" }
        ]
      }
    }
  })

  const rest3 = await prisma.restaurant.create({
    data: {
      name: "신선한 초밥마을",
      description: "매일 아침 들어오는 신선한 생선으로 만드는 초밥",
      imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop",
      menus: {
        create: [
          { name: "모둠 초밥 (10p)", price: 15000, description: "광어, 연어, 참치, 새우 등", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400&auto=format&fit=crop" },
          { name: "연어 초밥 (10p)", price: 17000, description: "최상급 노르웨이산 연어 초밥", imageUrl: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=400&auto=format&fit=crop" }
        ]
      }
    }
  })

  console.log("Seeding finished.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
