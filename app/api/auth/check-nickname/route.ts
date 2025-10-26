import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

/**
 * GET /api/auth/check-nickname?nickname=test
 * Проверка доступности никнейма
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nickname = searchParams.get("nickname")

    if (!nickname) {
      return NextResponse.json(
        { available: false, message: "Nickname обязателен" },
        { status: 400 }
      )
    }

    // Валидация формата
    if (nickname.length < 3 || nickname.length > 20) {
      return NextResponse.json({
        available: false,
        message: "Nickname должен быть от 3 до 20 символов",
      })
    }

    const nicknameRegex = /^[a-zA-Z0-9_]+$/
    if (!nicknameRegex.test(nickname)) {
      return NextResponse.json({
        available: false,
        message: "Nickname может содержать только буквы, цифры и подчеркивание",
      })
    }

    // Проверка уникальности (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: {
        nickname: {
          equals: nickname,
          mode: 'insensitive',
        },
      },
    })

    if (existingUser) {
      return NextResponse.json({
        available: false,
        message: `Nickname "${nickname}" уже занят`,
      })
    }

    return NextResponse.json({
      available: true,
      message: "Nickname доступен",
    })
  } catch (error) {
    console.error("Check nickname error:", error)
    return NextResponse.json(
      { available: false, message: "Ошибка проверки nickname" },
      { status: 500 }
    )
  }
}
