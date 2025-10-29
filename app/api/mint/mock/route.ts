import { NextRequest, NextResponse } from 'next/server'
import { userCards } from '@/lib/spawn-storage'

/**
 * POST /api/mint/mock - Mock минт NFT (для тестирования)
 * В будущем заменить на реальный blockchain минт
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cardId, userId, chain } = body

    console.log('🎨 Mock минт NFT:', { cardId, userId, chain })

    if (!cardId || !userId) {
      return NextResponse.json({
        error: 'Missing parameters',
        message: 'Укажите cardId и userId'
      }, { status: 400 })
    }

    // Находим карту в инвентаре пользователя
    const card = userCards.find(c => c.id === cardId && c.userId === userId)

    if (!card) {
      return NextResponse.json({
        error: 'Card not found',
        message: 'Карта не найдена в вашем инвентаре'
      }, { status: 404 })
    }

    // Проверяем что карта еще не заминчена
    if (card.tokenId) {
      return NextResponse.json({
        error: 'Already minted',
        message: 'Эта карта уже заминчена'
      }, { status: 400 })
    }

    // Генерируем mock tokenId
    const tokenId = `${chain}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Сохраняем tokenId в карте
    card.tokenId = tokenId
    card.mintedAt = new Date()
    card.chain = chain

    console.log('✅ Карта заминчена:', {
      cardId,
      tokenId,
      chain
    })

    return NextResponse.json({
      success: true,
      message: `🎉 NFT успешно заминчен на ${chain.toUpperCase()}!`,
      tokenId,
      chain,
      card: {
        id: card.id,
        name: card.cardId,
        tokenId,
        mintedAt: card.mintedAt
      }
    })

  } catch (error) {
    console.error('Error during mock mint:', error)
    return NextResponse.json({
      error: 'Failed to mint',
      message: 'Произошла ошибка при минте'
    }, { status: 500 })
  }
}
