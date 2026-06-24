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

  const optionsByCategory: Record<string, any> = {
    "분식": [
      { name: "음료 추가", choices: ["선택 안함", "쿨피스(+2000원)", "콜라(+2000원)"] },
      { name: "사이드 추가", choices: ["선택 안함", "모둠튀김(+4000원)", "참치마요 컵밥(+3500원)"] }
    ],
    "패스트푸드": [
      { name: "세트 변경", choices: ["선택 안함(단품)", "프렌치 프라이(M) + 콜라(M) (+2500원)", "치즈스틱 + 사이다(M) (+3000원)"] },
      { name: "소스 추가", choices: ["선택 안함", "스위트 칠리 소스(+500원)", "케이준 소스(+500원)"] }
    ],
    "일식": [
      { name: "사이드 추가", choices: ["선택 안함", "미니 우동(+3000원)", "왕새우튀김 2pcs(+4000원)", "감자고로케 2pcs(+3000원)"] },
      { name: "음료 추가", choices: ["선택 안함", "콜라(+2000원)", "라무네(+3000원)"] }
    ],
    "양식": [
      { name: "사이드 메뉴", choices: ["선택 안함", "갈릭 빠네(+6000원)", "양송이 수프(+4500원)"] },
      { name: "음료/와인", choices: ["선택 안함", "자몽 에이드(+5000원)", "하우스 와인(1잔)(+8000원)"] }
    ],
    "중식": [
      { name: "사이드 추가", choices: ["선택 안함", "군만두 4pcs(+3000원)", "꽃빵 3pcs(+3000원)"] },
      { name: "주류/음료", choices: ["선택 안함", "콜라(+2000원)", "칭따오 맥주(+6000원)", "연태고량주(소)(+12000원)"] }
    ],
    "한식": [
      { name: "사이드 추가", choices: ["선택 안함", "폭탄 계란찜(+4000원)", "공기밥 추가(+1000원)"] },
      { name: "음료 추가", choices: ["선택 안함", "전통 식혜(+2000원)", "콜라(+2000원)", "사이다(+2000원)"] }
    ]
  }

  const basicOptions = [
    { name: "음료 추가", choices: ["선택 안함", "콜라(+2000원)", "사이다(+2000원)"] }
  ]

  const restaurants = [
    // 분식
    { 
      name: "동대문 엽기떡볶이", category: "분식", desc: "스트레스 풀리는 매운맛", img: "https://tse1.mm.bing.net/th?q=엽기떡볶이+치즈+실사",
      menus: [
        { name: "엽기떡볶이", price: 14000, desc: "맛있게 매운 엽기떡볶이", img: "https://tse1.mm.bing.net/th?q=엽기떡볶이" },
        { name: "모둠튀김", price: 4000, desc: "바삭한 야채, 김말이, 만두 튀김", img: "https://tse1.mm.bing.net/th?q=분식+모둠튀김" },
        { name: "참치마요밥", price: 3500, desc: "매운맛을 달래주는 고소한 참치마요", img: "https://tse1.mm.bing.net/th?q=참치마요+주먹밥" }
      ]
    },
    { 
      name: "신전떡볶이", category: "분식", desc: "후추맛 가득한 매콤달콤 떡볶이", img: "https://tse1.mm.bing.net/th?q=신전떡볶이+치즈떡볶이+실사",
      menus: [
        { name: "치즈떡볶이", price: 5500, desc: "신전 특제 소스와 듬뿍 올라간 치즈", img: "https://tse1.mm.bing.net/th?q=신전+치즈떡볶이" },
        { name: "튀김오뎅 (6개)", price: 1700, desc: "신전의 시그니처 튀김오뎅", img: "https://tse1.mm.bing.net/th?q=신전+튀김오뎅" },
        { name: "신전 치즈김밥", price: 4000, desc: "매콤한 밥 안에 고소한 치즈가 듬뿍", img: "https://tse1.mm.bing.net/th?q=신전+치즈김밥" }
      ]
    },
    { 
      name: "죠스떡볶이", category: "분식", desc: "매콤달콤한 소스와 바삭한 튀김", img: "https://tse1.mm.bing.net/th?q=죠스떡볶이+세트",
      menus: [
        { name: "죠스떡볶이", price: 4500, desc: "한입에 쏙 들어가는 쫄깃한 떡볶이", img: "https://tse1.mm.bing.net/th?q=죠스떡볶이+떡볶이" },
        { name: "수제튀김", price: 4000, desc: "매일 깨끗한 기름으로 튀겨낸 수제 튀김", img: "https://tse1.mm.bing.net/th?q=죠스떡볶이+수제튀김" },
        { name: "부산어묵", price: 3000, desc: "시원한 국물의 쫄깃한 어묵", img: "https://tse1.mm.bing.net/th?q=죠스떡볶이+어묵" }
      ]
    },
    
    // 패스트푸드
    { 
      name: "쉑쉑버거", category: "패스트푸드", desc: "프리미엄 수제 햄버거 쉑쉑", img: "https://tse1.mm.bing.net/th?q=쉑쉑버거",
      menus: [
        { name: "쉑버거", price: 8400, desc: "토마토, 양상추, 쉑소스가 토핑된 치즈버거", img: "https://tse1.mm.bing.net/th?q=쉑버거" },
        { name: "스모크쉑", price: 10600, desc: "베이컨, 체리 페퍼, 쉑소스가 토핑된 치즈버거", img: "https://tse1.mm.bing.net/th?q=스모크쉑" },
        { name: "치즈 프라이", price: 5900, desc: "특별한 치즈 소스가 듬뿍 올라간 크링클 컷 프라이", img: "https://tse1.mm.bing.net/th?q=쉑쉑+치즈프라이" }
      ]
    },
    { 
      name: "맥도날드", category: "패스트푸드", desc: "언제나 맛있는 빅맥과 감자튀김", img: "https://tse1.mm.bing.net/th?q=맥도날드+빅맥",
      menus: [
        { name: "빅맥 세트", price: 6900, desc: "100% 순 쇠고기 패티 두 장에 빅맥만의 특별한 소스", img: "https://tse1.mm.bing.net/th?q=빅맥+세트" },
        { name: "상하이 버거 세트", price: 6900, desc: "매콤한 시즈닝을 입힌 100% 닭가슴살", img: "https://tse1.mm.bing.net/th?q=맥스파이시+상하이버거" },
        { name: "맥너겟 6조각", price: 3500, desc: "바삭하고 촉촉한 치킨 맥너겟", img: "https://tse1.mm.bing.net/th?q=맥너겟" }
      ]
    },
    { 
      name: "버거킹", category: "패스트푸드", desc: "불맛 가득한 와퍼의 진수", img: "https://tse1.mm.bing.net/th?q=버거킹+와퍼+내돈내산+후기",
      menus: [
        { name: "와퍼 세트", price: 9100, desc: "직화로 구운 100% 순쇠고기 패티의 대표 버거", img: "https://tse1.mm.bing.net/th?q=버거킹+와퍼세트+내돈내산" },
        { name: "콰트로치즈와퍼", price: 9900, desc: "4가지 고품격 치즈와 불맛 가득한 패티의 조화", img: "https://tse1.mm.bing.net/th?q=콰트로치즈와퍼+실사" },
        { name: "어니언링", price: 2400, desc: "바삭바삭한 식감의 양파 튀김", img: "https://tse1.mm.bing.net/th?q=버거킹+어니언링+후기" }
      ]
    },
    
    // 일식
    { 
      name: "은행골", category: "일식", desc: "입에서 살살 녹는 부드러운 초밥", img: "https://tse1.mm.bing.net/th?q=은행골+초밥",
      menus: [
        { name: "특선초밥", price: 17000, desc: "연어, 활어, 장새우, 장어 등으로 구성된 특선", img: "https://tse1.mm.bing.net/th?q=은행골+특선초밥" },
        { name: "도로초밥", price: 29000, desc: "입에서 살살 녹는 최상급 참치 뱃살 초밥", img: "https://tse1.mm.bing.net/th?q=은행골+도로초밥" },
        { name: "연어초밥", price: 17000, desc: "부드럽고 신선한 연어 초밥", img: "https://tse1.mm.bing.net/th?q=은행골+연어초밥" }
      ]
    },
    { 
      name: "히노아지", category: "일식", desc: "진한 국물의 돈코츠 라멘", img: "https://tse1.mm.bing.net/th?q=돈코츠+라멘",
      menus: [
        { name: "돈코츠 라멘", price: 9500, desc: "오랜 시간 우려낸 진하고 구수한 돼지사골 국물", img: "https://tse1.mm.bing.net/th?q=돈코츠라멘" },
        { name: "카라미소 라멘", price: 10000, desc: "특제 매운 된장으로 맛을 낸 매콤한 라멘", img: "https://tse1.mm.bing.net/th?q=카라미소라멘" },
        { name: "수제 돈까스", price: 11000, desc: "바삭하고 두툼한 정통 일본식 돈까스", img: "https://tse1.mm.bing.net/th?q=일식+수제돈까스" }
      ]
    },
    { 
      name: "홍대돈부리", category: "일식", desc: "바삭한 돈까스가 올라간 가츠동", img: "https://tse1.mm.bing.net/th?q=가츠동",
      menus: [
        { name: "가츠동", price: 9000, desc: "두툼한 돈까스와 특제 쯔유 소스의 조화", img: "https://tse1.mm.bing.net/th?q=홍대돈부리+가츠동" },
        { name: "사케동", price: 14000, desc: "신선한 생연어가 듬뿍 올라간 연어 덮밥", img: "https://tse1.mm.bing.net/th?q=홍대돈부리+사케동" },
        { name: "에비가츠동", price: 10000, desc: "바삭한 왕새우 튀김이 올라간 덮밥", img: "https://tse1.mm.bing.net/th?q=에비가츠동" }
      ]
    },
    
    // 양식
    { 
      name: "아웃백 스테이크하우스", category: "양식", desc: "정통 호주식 스테이크와 파스타", img: "https://tse1.mm.bing.net/th?q=아웃백+스테이크하우스",
      menus: [
        { name: "투움바 파스타", price: 26900, desc: "최고급 파마산 치즈와 새우, 양송이를 볶아낸 깊은 맛", img: "https://tse1.mm.bing.net/th?q=아웃백+투움바파스타" },
        { name: "갈릭 립아이", price: 47900, desc: "구운 마늘과 마늘칩이 어우러진 꽃등심 스테이크", img: "https://tse1.mm.bing.net/th?q=아웃백+갈릭립아이" },
        { name: "오지 치즈 후라이즈", price: 10900, desc: "듬뿍 녹아내린 잭 치즈와 베이컨이 뿌려진 감자튀김", img: "https://tse1.mm.bing.net/th?q=아웃백+오지치즈후라이" }
      ]
    },
    { 
      name: "롤링파스타", category: "양식", desc: "가성비 최고의 맛있는 파스타", img: "https://tse1.mm.bing.net/th?q=롤링파스타",
      menus: [
        { name: "매운 우삼겹 토마토 파스타", price: 8500, desc: "매콤한 토마토 소스에 고소한 우삼겹이 어우러진 파스타", img: "https://tse1.mm.bing.net/th?q=매운우삼겹토마토파스타" },
        { name: "로제 크림 쉬림프 파스타", price: 8900, desc: "부드러운 로제 크림에 새우가 들어간 파스타", img: "https://tse1.mm.bing.net/th?q=로제크림쉬림프파스타" },
        { name: "고르곤졸라 피자", price: 8800, desc: "고르곤졸라 치즈의 풍미가 가득한 얇고 바삭한 피자", img: "https://tse1.mm.bing.net/th?q=고르곤졸라+피자" }
      ]
    },
    { 
      name: "매드포갈릭", category: "양식", desc: "마늘을 테마로 한 독특한 이탈리안", img: "https://tse1.mm.bing.net/th?q=매드포갈릭+갈릭스노잉피자+실사",
      menus: [
        { name: "갈릭 스노잉 피자", price: 26800, desc: "화이트 소스에 새우, 파인애플, 튀긴 마늘이 어우러진 피자", img: "https://tse1.mm.bing.net/th?q=갈릭스노잉피자" },
        { name: "갈릭페뇨 파스타", price: 24800, desc: "할라피뇨와 마늘로 맛을 낸 매콤한 올리브 오일 파스타", img: "https://tse1.mm.bing.net/th?q=갈릭페뇨파스타" },
        { name: "댄싱 살사 라이스 위드 비프", price: 27800, desc: "부드러운 소고기와 숙주를 살사 소스에 볶아낸 철판 볶음밥", img: "https://tse1.mm.bing.net/th?q=댄싱살사라이스위드비프" }
      ]
    },

    // 중식
    { 
      name: "홍콩반점", category: "중식", desc: "불맛 가득 짬뽕과 바삭한 탕수육", img: "https://tse1.mm.bing.net/th?q=홍콩반점+짜장면",
      menus: [
        { name: "짜장면", price: 6500, desc: "달콤하고 진한 춘장 소스의 정통 짜장면", img: "https://tse1.mm.bing.net/th?q=홍콩반점+짜장면" },
        { name: "짬뽕", price: 7800, desc: "오징어와 돼지고기가 듬뿍 들어간 얼큰한 불맛 짬뽕", img: "https://tse1.mm.bing.net/th?q=홍콩반점+짬뽕" },
        { name: "탕수육 (소)", price: 16900, desc: "쫀득한 식감의 찹쌀 탕수육", img: "https://tse1.mm.bing.net/th?q=홍콩반점+탕수육" }
      ]
    },
    { 
      name: "마라공방", category: "중식", desc: "얼얼하고 매콤한 리얼 마라탕", img: "https://tse1.mm.bing.net/th?q=마라공방+마라탕",
      menus: [
        { name: "소고기 마라탕", price: 15000, desc: "얼얼한 특제 소스에 푸짐한 소고기와 야채", img: "https://tse1.mm.bing.net/th?q=소고기+마라탕" },
        { name: "꿔바로우 (소)", price: 13000, desc: "새콤달콤한 소스의 쫄깃한 중국식 탕수육", img: "https://tse1.mm.bing.net/th?q=꿔바로우" },
        { name: "마라샹궈", price: 18000, desc: "매콤한 마라 소스에 볶아낸 각종 야채와 고기", img: "https://tse1.mm.bing.net/th?q=마라샹궈" }
      ]
    },
    { 
      name: "북경반점", category: "중식", desc: "전통 짜장면과 군만두의 조화", img: "https://tse1.mm.bing.net/th?q=중국집+짜장면",
      menus: [
        { name: "간짜장", price: 7500, desc: "갓 볶아낸 춘장과 양파의 아삭한 식감", img: "https://tse1.mm.bing.net/th?q=간짜장" },
        { name: "차돌짬뽕", price: 11000, desc: "고소한 차돌박이가 듬뿍 들어간 진한 국물", img: "https://tse1.mm.bing.net/th?q=차돌짬뽕" },
        { name: "군만두", price: 6000, desc: "바삭하게 튀겨낸 정통 중국식 군만두", img: "https://tse1.mm.bing.net/th?q=중국집+군만두" }
      ]
    },

    // 한식
    { 
      name: "원할머니보쌈", category: "한식", desc: "부드러운 고기와 매콤달콤 무김치", img: "https://tse1.mm.bing.net/th?q=원할머니보쌈",
      menus: [
        { name: "모둠보쌈 (소)", price: 34000, desc: "담백한 수육과 다양한 김치가 어우러진 모둠", img: "https://tse1.mm.bing.net/th?q=원할머니보쌈+모둠보쌈" },
        { name: "의성마늘 떡보쌈", price: 37000, desc: "쫄깃한 떡쌈에 마늘 소스를 더한 특별한 보쌈", img: "https://tse1.mm.bing.net/th?q=마늘보쌈" },
        { name: "새싹쟁반무침면", price: 12000, desc: "매콤달콤한 소스에 비벼 먹는 신선한 쟁반면", img: "https://tse1.mm.bing.net/th?q=쟁반막국수" }
      ]
    },
    { 
      name: "본죽", category: "한식", desc: "정성으로 끓인 따뜻한 영양죽", img: "https://tse1.mm.bing.net/th?q=본죽",
      menus: [
        { name: "전복죽", price: 13000, desc: "영양 만점 신선한 전복이 듬뿍 들어간 보양죽", img: "https://tse1.mm.bing.net/th?q=본죽+전복죽" },
        { name: "낙지김치죽", price: 11000, desc: "매콤한 김치와 쫄깃한 낙지의 환상적인 조화", img: "https://tse1.mm.bing.net/th?q=본죽+낙지김치죽" },
        { name: "단호박죽", price: 10000, desc: "달콤하고 부드러운 영양 간식 단호박죽", img: "https://tse1.mm.bing.net/th?q=본죽+단호박죽" }
      ]
    },
    { 
      name: "김밥천국", category: "한식", desc: "언제나 든든한 종합 분식 한식당", img: "https://tse1.mm.bing.net/th?q=김밥천국+김밥",
      menus: [
        { name: "원조김밥", price: 3000, desc: "언제 먹어도 맛있는 기본에 충실한 김밥", img: "https://tse1.mm.bing.net/th?q=기본김밥" },
        { name: "참치김밥", price: 4500, desc: "고소한 참치와 깻잎이 듬뿍 들어간 인기 메뉴", img: "https://tse1.mm.bing.net/th?q=참치김밥" },
        { name: "치즈돈까스", price: 8500, desc: "모짜렐라 치즈가 듬뿍 들어간 바삭한 돈까스", img: "https://tse1.mm.bing.net/th?q=치즈돈까스" }
      ]
    }
  ]

  for (const r of restaurants) {
    await prisma.restaurant.create({
      data: {
        name: r.name,
        category: r.category,
        description: r.desc,
        imageUrl: r.img,
        menus: {
          create: r.menus.map(m => ({
            name: m.name,
            price: m.price,
            description: m.desc,
            imageUrl: m.img,
            options: optionsByCategory[r.category] || basicOptions
          }))
        }
      }
    })
  }

  console.log("Seeding finished with varied options.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
