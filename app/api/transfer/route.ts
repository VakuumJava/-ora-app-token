import { NextRequest, NextResponse } from 'next/server'
import { userCards, userProfiles } from '@/lib/spawn-storage'

/**
 * POST /api/transfer - Передача NFT карты другому пользователю
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cardId, recipientUsername, userId } = body
    
    console.log('📤 Запрос на передачу:', { cardId, recipientUsername, userId })
    
    if (!cardId || !recipientUsername || !userId) {
      return NextResponse.json({
        error: 'Missing parameters',
        message: 'Укажите ID карты, username получателя и userId'
      }, { status: 400 })
    }
    
    // Проверяем что карта существует и принадлежит отправителю
    const card = userCards.find(c => c.id === cardId && c.userId === userId)
    
    if (!card) {
      return NextResponse.json({
        error: 'Card not found',
        message: 'Карта не найдена в вашем инвентаре'
      }, { status: 404 })
    }
    
    // Очищаем username от @
    const cleanUsername = recipientUsername.replace('@', '').trim()
    
    // Проверяем существование получателя
    const recipient = userProfiles.find(u => u.username === cleanUsername)
    
    if (!recipient) {
      return NextResponse.json({
        error: 'User not found',
        message: `Пользователь @${cleanUsername} не найден`
      }, { status: 404 })
    }
    
    // Проверяем что не передаём самому себе
    if (recipient.id === userId) {
      return NextResponse.json({
        error: 'Cannot transfer to self',
        message: 'Нельзя передать карту самому себе'
      }, { status: 400 })
    }
    
    // Передаём карту
    card.userId = recipient.id
    
    console.log('✅ Карта передана:', {
      cardId,
      from: userId,
      to: recipient.id,
      username: recipient.username
    })
    
    return NextResponse.json({
      success: true,
      message: `✅ Карта успешно передана пользователю @${recipient.username}!`,
      transfer: {
        cardId,
        from: userId,
        to: recipient.id,
        toUsername: recipient.username,
        timestamp: new Date()
      }
    })
    
  } catch (error) {
    console.error('Error during transfer:', error)
    return NextResponse.json({ 
      error: 'Failed to transfer',
      message: 'Произошла ошибка при передаче карты'
    }, { status: 500 })
  }
}
