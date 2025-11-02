import { NextResponse } from 'next/server'
import { getUserStats, getOrCreateUser } from '@/lib/db-storage'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userNickname = searchParams.get('userId') || 'demo-user'

    

    // Получаем пользователя
    const user = await getOrCreateUser(userNickname)

    // Получаем статистику
    const stats = await getUserStats(user.id)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Ошибка получения статистики' },
      { status: 500 }
    )
  }
}
