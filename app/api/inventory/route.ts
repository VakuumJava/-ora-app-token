import { NextResponse } from 'next/server'
import { getUserInventory, getOrCreateUser } from '@/lib/db-storage'

/**
 * GET /api/inventory?userId=nickname
 * Получает инвентарь пользователя
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userNickname = searchParams.get('userId') || 'demo-user'
    
    
    
    // Получаем или создаем пользователя
    const user = await getOrCreateUser(userNickname)
    
    // Получаем инвентарь
    const { shards, cards } = await getUserInventory(user.id)
    
    // Подсчитываем по редкости
    const shardsByRarity: Record<string, number> = {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    }
    
    const cardsByRarity: Record<string, number> = {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    }
    
    // Подсчитываем осколки по редкости карточки
    shards.forEach(us => {
      const rarity = us.shard.card.rarity.toLowerCase()
      if (rarity in shardsByRarity) {
        shardsByRarity[rarity]++
      }
    })
    
    // Подсчитываем карты по редкости
    cards.forEach(uc => {
      const rarity = uc.card.rarity.toLowerCase()
      if (rarity in cardsByRarity) {
        cardsByRarity[rarity]++
      }
    })
    
    // Форматируем для фронтенда
    return NextResponse.json({
      fragments: {
        total: shards.length,
        byRarity: shardsByRarity,
        items: shards.map(us => ({
          id: us.id,
          fragmentId: us.shard.id,
          shardId: us.shard.id,
          label: us.shard.label,
          name: `Осколок ${us.shard.label}`,
          imageUrl: us.shard.imageUrl,
          collectedAt: us.collectedAt,
          rarity: us.shard.card.rarity
        }))
      },
      cards: {
        total: cards.length,
        byRarity: cardsByRarity,
        items: cards.map(uc => ({
          id: uc.id,
          cardId: uc.card.id,
          name: uc.card.name,
          description: uc.card.description || '',
          imageUrl: uc.card.imageUrl || '',
          rarity: uc.card.rarity,
          craftedAt: uc.assembledAt,
          mintedAt: uc.assembledAt,
          tokenId: uc.tokenId,
          owner: user.nickname,
          userId: user.id // Добавляем userId для минта
        }))
      }
    })
  } catch (error: any) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Ошибка получения инвентаря', details: error.message },
      { status: 500 }
    )
  }
}
