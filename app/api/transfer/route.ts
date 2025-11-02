import { NextRequest, NextResponse } from 'next/server'
import { transferCard, getOrCreateUser } from '@/lib/db-storage'

/**
 * POST /api/transfer - Передача NFT карты другому пользователю
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cardId, recipientUsername, userId: fromNickname } = body
    
    
    
    if (!cardId || !recipientUsername || !fromNickname) {
      return NextResponse.json({
        error: 'Missing parameters',
        message: 'Укажите все параметры'
      }, { status: 400 })
    }

    // Получаем пользователя
    const fromUser = await getOrCreateUser(fromNickname)

    // Очищаем username от @
    const cleanUsername = recipientUsername.replace('@', '').trim()

    // Передаем карту
    const toUser = await transferCard(cardId, fromUser.id, cleanUsername)

    
      cardId,
      from: fromUser.nickname,
      to: toUser.nickname
    })

    return NextResponse.json({
      success: true,
      message: `✅ Карта успешно передана пользователю @${toUser.nickname}!`
    })

  } catch (error: any) {
    console.error('Error during transfer:', error)
    return NextResponse.json({ 
      error: 'Failed to transfer',
      message: error.message || 'Произошла ошибка при передаче карты'
    }, { status: 500 })
  }
}
