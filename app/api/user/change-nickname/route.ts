import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAccessToken } from '@/lib/jwt'

/**
 * POST /api/user/change-nickname
 * Изменение никнейма пользователя (освобождает старый)
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    const { newNickname } = await request.json()

    // Валидация
    if (!newNickname || newNickname.length < 3 || newNickname.length > 20) {
      return NextResponse.json(
        { error: 'Никнейм должен быть от 3 до 20 символов' },
        { status: 400 }
      )
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newNickname)) {
      return NextResponse.json(
        { error: 'Никнейм может содержать только буквы, цифры и _' },
        { status: 400 }
      )
    }

    // Проверка доступности
    const existingUser = await prisma.user.findFirst({
      where: {
        nickname: {
          equals: newNickname,
          mode: 'insensitive',
        },
      },
    })

    if (existingUser && existingUser.id !== payload.userId) {
      return NextResponse.json(
        { error: 'Этот никнейм уже занят' },
        { status: 409 }
      )
    }

    // Обновление никнейма
    await prisma.user.update({
      where: { id: payload.userId },
      data: { nickname: newNickname },
    })

    return NextResponse.json(
      { message: 'Никнейм успешно изменён', newNickname },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error changing nickname:', error)
    return NextResponse.json(
      { error: 'Ошибка при изменении никнейма' },
      { status: 500 }
    )
  }
}
