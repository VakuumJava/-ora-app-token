import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/admin/shards - Получить список всех shards для админки
 */
export async function GET(request: NextRequest) {
  try {
    const shards = await prisma.shard.findMany({
      include: {
        card: {
          select: {
            id: true,
            name: true,
            rarity: true,
            imageUrl: true
          }
        }
      },
      orderBy: [
        { cardId: 'asc' },
        { label: 'asc' }
      ]
    })

    

    return NextResponse.json({
      success: true,
      shards: shards.map(shard => ({
        id: shard.id,
        label: shard.label,
        cardId: shard.cardId,
        cardName: shard.card.name,
        cardRarity: shard.card.rarity,
        cardImage: shard.card.imageUrl,
        displayName: `${shard.card.name} - Fragment ${shard.label}`
      }))
    })
  } catch (error: any) {
    console.error('❌ Ошибка получения shards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shards', details: error.message },
      { status: 500 }
    )
  }
}
