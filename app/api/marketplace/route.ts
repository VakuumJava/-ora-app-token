import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/jwt'

/**
 * GET /api/marketplace
 * Получает доступные для покупки карты
 */
export async function GET() {
  try {
    // Проверяем авторизацию
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    // Получаем все активные карты которые можно купить (системные)
    const availableCards = await prisma.card.findMany({
      where: {
        active: true,
      },
      include: {
        collection: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Форматируем данные для фронтенда
    const marketplace = availableCards.map((card) => ({
      id: card.id,
      name: card.name,
      description: card.description || '',
      imageUrl: card.imageUrl,
      rarity: card.rarity,
      price: getRarityPrice(card.rarity), // Цена зависит от редкости
      collection: card.collection.name,
      supplyLimit: card.supplyLimit,
      mintedCount: card.mintedCount,
      available: card.supplyLimit ? card.supplyLimit - card.mintedCount : 999999,
      seller: 'Qora Platform', // Продавец - система
    }))

    return NextResponse.json({
      listings: marketplace,
      total: marketplace.length,
    })
  } catch (error) {
    console.error('Error fetching marketplace:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки маркетплейса' },
      { status: 500 }
    )
  }
}

// Цены в зависимости от редкости
function getRarityPrice(rarity: string): number {
  const prices: Record<string, number> = {
    common: 5,
    uncommon: 15,
    rare: 35,
    epic: 75,
    legendary: 150,
  }
  return prices[rarity] || 10
}
