import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return new NextResponse("이메일과 비밀번호를 입력해주세요.", { status: 400 })
    }

    // 이미 가입된 이메일인지 확인
    const exist = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (exist) {
      return new NextResponse("이미 가입된 이메일입니다.", { status: 400 })
    }

    // 비밀번호 해싱 (안전하게 저장)
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || "사용자", // 이름이 없으면 기본값
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("회원가입 에러:", error);
    return new NextResponse("서버 내부 오류가 발생했습니다.", { status: 500 })
  }
}
