import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt'

/**
 * POST /api/auth/register
 * Регистрация нового пользователя
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, nickname, password } = body

    // Валидация
    if (!email || !nickname || !password) {
      return NextResponse.json(
        { error: 'Email, nickname и password обязательны' },
        { status: 400 }
      )
    }

    // Проверка формата nickname
    if (nickname.length < 3 || nickname.length > 20) {
      return NextResponse.json(
        { error: 'Nickname должен быть от 3 до 20 символов' },
        { status: 400 }
      )
    }

    const nicknameRegex = /^[a-zA-Z0-9_]+$/
    if (!nicknameRegex.test(nickname)) {
      return NextResponse.json(
        { error: 'Nickname может содержать только буквы, цифры и подчеркивание' },
        { status: 400 }
      )
    }

    // Проверка длины пароля
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен быть минимум 6 символов' },
        { status: 400 }
      )
    }

    // Проверка уникальности email и nickname (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { nickname: { equals: nickname, mode: 'insensitive' } },
        ],
      },
    })

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json(
          { error: 'Пользователь с таким email уже существует' },
          { status: 409 }
        )
      }
      if (existingUser.nickname.toLowerCase() === nickname.toLowerCase()) {
        return NextResponse.json(
          { error: `Nickname "${nickname}" уже занят` },
          { status: 409 }
        )
      }
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(password, 10)

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        nickname,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatarUrl: true,
        bio: true,
        totalShards: true,
        totalCards: true,
        createdAt: true,
      },
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

    // Установка cookies
    const response = NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 201 }
    )

    // HttpOnly cookies для безопасности
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Ошибка регистрации' },
      { status: 500 }
    )
  }
}
