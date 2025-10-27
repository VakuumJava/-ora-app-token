import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAccessToken } from '@/lib/jwt'
import { generateVerificationToken, sendVerificationEmail } from '@/lib/email'

/**
 * POST /api/user/change-email
 * Изменение email (требует верификации нового email)
 */
export async function POST(request: NextRequest) {
  try {
    // Проверяем оба варианта названия cookie (accessToken и access_token)
    const token = request.cookies.get('access_token')?.value || 
                  request.cookies.get('accessToken')?.value

    console.log('🔐 Change email attempt:', { 
      hasToken: !!token,
      cookies: request.cookies.getAll().map(c => c.name)
    })

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload) {
      console.log('❌ Invalid token')
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    console.log('✅ User authenticated:', { userId: payload.userId, email: payload.email })

    const { newEmail } = await request.json()

    // Валидация
    if (!newEmail || !newEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Некорректный email адрес' },
        { status: 400 }
      )
    }

    // Проверка, что email не занят
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail.toLowerCase() },
    })

    if (existingUser && existingUser.id !== payload.userId) {
      return NextResponse.json(
        { error: 'Этот email уже используется' },
        { status: 409 }
      )
    }

    // Генерация токена верификации
    const verificationToken = generateVerificationToken()
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 часа

    // Обновление email и токена (emailVerified = false до подтверждения)
    await prisma.user.update({
      where: { id: payload.userId },
      data: {
        email: newEmail.toLowerCase(),
        emailVerified: false,
        verificationToken,
        verificationTokenExpiry,
      },
    })

    // Отправка письма на новый email
    try {
      await sendVerificationEmail(newEmail, verificationToken)
      console.log('✅ Verification email sent to:', newEmail)
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError)
      // Продолжаем выполнение, даже если email не отправился
    }

    return NextResponse.json(
      { message: 'Письмо с подтверждением отправлено на новый email' },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error changing email:', error)
    return NextResponse.json(
      { error: 'Ошибка при изменении email' },
      { status: 500 }
    )
  }
}
