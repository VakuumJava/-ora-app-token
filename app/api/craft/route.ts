import { NextRequest, NextResponse } from 'next/server'
import { craftCard, getOrCreateUser } from '@/lib/db-storage'

/**
 * POST /api/craft - Скрафтить NFT карту из 3 осколков
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shardIds, userId: userNickname } = body

    console.log('🎨 Craft request:', { shardIds, userNickname })

    if (!shardIds || !Array.isArray(shardIds) || shardIds.length !== 3) {
      return NextResponse.json({
        error: 'Invalid shards',
        message: 'Требуется 3 осколка для крафта'
      }, { status: 400 })
    }

    if (!userNickname) {
      return NextResponse.json({
        error: 'Missing userId',
        message: 'Укажите userId'
      }, { status: 400 })
    }

    // Получаем пользователя
    const user = await getOrCreateUser(userNickname)

    // Крафтим карту
    const userCard = await craftCard(user.id, shardIds)

    console.log('🎉 NFT карта создана:', userCard.id)

    return NextResponse.json({
      success: true,
      message: `🎉 Поздравляем! Вы создали NFT карту "${userCard.card.name}"!`,
      card: {
        id: userCard.id,
        cardId: userCard.card.id,
        name: userCard.card.name,
        description: userCard.card.description,
        imageUrl: userCard.card.imageUrl,
        rarity: userCard.card.rarity,
        craftedAt: userCard.assembledAt
      }
    })

  } catch (error: any) {
    console.error('❌ Craft error:', error)
    return NextResponse.json({
      error: 'Craft failed',
      message: error.message || 'Не удалось создать карту'
    }, { status: 500 })
  }
}
