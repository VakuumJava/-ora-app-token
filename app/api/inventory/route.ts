import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/jwt'

/**
 * GET /api/inventory
 * Получает инвентарь пользователя: фрагменты и карты
 */
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    // Получаем осколки пользователя
    const userShards = await prisma.userShard.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        shard: {
          include: {
            card: true, // Включаем информацию о карте
          },
        },
      },
      orderBy: {
        collectedAt: 'desc',
      },
    })

    // Получаем карты пользователя
    const userCards = await prisma.userCard.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        card: true, // Включаем данные о самой карте
      },
      orderBy: {
        assembledAt: 'desc',
      },
    })

    // Группируем осколки по редкости
    const shardsByRarity = {
      common: userShards.filter((us: any) => us.shard.card.rarity === 'common'),
      uncommon: userShards.filter((us: any) => us.shard.card.rarity === 'uncommon'),
      rare: userShards.filter((us: any) => us.shard.card.rarity === 'rare'),
      epic: userShards.filter((us: any) => us.shard.card.rarity === 'epic'),
      legendary: userShards.filter((us: any) => us.shard.card.rarity === 'legendary'),
    }

    // Группируем карты по редкости
    const cardsByRarity = {
      common: userCards.filter((uc: any) => uc.card.rarity === 'common'),
      uncommon: userCards.filter((uc: any) => uc.card.rarity === 'uncommon'),
      rare: userCards.filter((uc: any) => uc.card.rarity === 'rare'),
      epic: userCards.filter((uc: any) => uc.card.rarity === 'epic'),
      legendary: userCards.filter((uc: any) => uc.card.rarity === 'legendary'),
    }

    return NextResponse.json({
      fragments: {
        total: userShards.length,
        byRarity: {
          common: shardsByRarity.common.length,
          uncommon: shardsByRarity.uncommon.length,
          rare: shardsByRarity.rare.length,
          epic: shardsByRarity.epic.length,
          legendary: shardsByRarity.legendary.length,
        },
        items: userShards.map((us: any) => ({
          id: us.id,
          fragmentId: us.shardId,
          name: `${us.shard.card.name} - Осколок ${us.shard.label}`,
          description: us.shard.card.description || '',
          rarity: us.shard.card.rarity,
          imageUrl: us.shard.imageUrl,
          collectedAt: us.collectedAt,
        })),
      },
      cards: {
        total: userCards.length,
        byRarity: {
          common: cardsByRarity.common.length,
          uncommon: cardsByRarity.uncommon.length,
          rare: cardsByRarity.rare.length,
          epic: cardsByRarity.epic.length,
          legendary: cardsByRarity.legendary.length,
        },
        items: userCards.map((uc: any) => ({
          id: uc.id,
          cardId: uc.cardId,
          name: uc.card.name,
          description: uc.card.description || '',
          rarity: uc.card.rarity,
          imageUrl: uc.card.imageUrl,
          mintedAt: uc.assembledAt,
          tokenId: uc.tokenId,
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки инвентаря' },
      { status: 500 }
    )
  }
}
