import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из куки
    const token = request.cookies.get('access_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    // Проверяем токен
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    // Получаем данные пользователя
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        createdAt: true,
        totalShards: true,
        totalCards: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    // Вычисляем количество дней на сайте
    const now = new Date()
    const createdAt = new Date(user.createdAt)
    const daysOnSite = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

    // Возвращаем статистику
    return NextResponse.json({
      daysOnSite,
      shardsFound: user.totalShards || 0,
      cardsOwned: user.totalCards || 0,
    })

  } catch (error: any) {
    console.error('Ошибка получения статистики:', error)
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Невалидный токен' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
