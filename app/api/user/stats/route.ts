import { NextResponse } from 'next/server'
import { userInventory, userCards } from '@/lib/spawn-storage'

export async function GET(request: Request) {
  try {
    // Получаем userId из query параметров
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user'

    console.log('📊 Запрос статистики для:', userId)

    // Подсчитываем статистику из in-memory хранилища
    const userShards = userInventory.filter(item => item.userId === userId)
    const userNFTCards = userCards.filter(item => item.userId === userId)

    // Возвращаем статистику
    return NextResponse.json({
      totalShards: userShards.length,
      totalCards: userNFTCards.length,
      daysOnSite: 0, // Пока не отслеживаем
      shardsFound: userShards.length,
      cardsOwned: userNFTCards.length,
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Ошибка получения статистики' },
      { status: 500 }
    )
  }
}
