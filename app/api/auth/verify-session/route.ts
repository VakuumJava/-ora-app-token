import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Проверка валидности сессии пользователя
 * POST /api/auth/verify-session
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { valid: false, error: 'Missing userId' },
        { status: 400 }
      )
    }

    // Проверяем существование пользователя в базе
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nickname: true, email: true }
    })

    if (!user) {
      return NextResponse.json({ valid: false })
    }

    // Сессия валидна
    return NextResponse.json({
      valid: true,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email
      }
    })

  } catch (error: any) {
    console.error('❌ Session verification error:', error)
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
