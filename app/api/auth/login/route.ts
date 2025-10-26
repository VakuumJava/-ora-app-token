import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt'

/**
 * POST /api/auth/login
 * Вход пользователя (по email или nickname)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, password } = body // identifier = email или nickname

    // Валидация
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/nickname и password обязательны' },
        { status: 400 }
      )
    }

    // Поиск пользователя по email или nickname (case-insensitive)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { nickname: { equals: identifier, mode: 'insensitive' } },
        ],
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Неверный email/nickname или пароль' },
        { status: 401 }
      )
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Неверный email/nickname или пароль' },
        { status: 401 }
      )
    }

    // Обновление lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Генерация JWT токенов
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      nickname: user.nickname,
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      nickname: user.nickname,
    })

    // Сохранение refresh token в базе
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
      },
    })

    // Подготовка данных пользователя (без пароля)
    const { passwordHash: _, ...userWithoutPassword } = user

    // Установка cookies
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })

    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 минут
      path: '/',
    })

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 дней
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Ошибка входа' },
      { status: 500 }
    )
  }
}
