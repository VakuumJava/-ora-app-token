import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/jwt'

export async function GET() {
  try {
    // Получаем текущего пользователя
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    // Получаем данные пользователя из базы
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        createdAt: true,
        totalShards: true,
        totalCards: true,
      }
    })

    if (!userData) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    // Вычисляем количество дней на сайте
    const now = new Date()
    const createdAt = new Date(userData.createdAt)
    const daysOnSite = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

    // Возвращаем статистику
    return NextResponse.json({
      daysOnSite,
      shardsFound: userData.totalShards || 0,
      cardsOwned: userData.totalCards || 0,
    })

  } catch (error: any) {
    console.error('Ошибка получения статистики:', error)

    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
