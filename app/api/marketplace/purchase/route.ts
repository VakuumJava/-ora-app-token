import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/jwt'

/**
 * POST /api/marketplace/purchase
 * Покупка карты на маркетплейсе
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const { cardId } = await request.json()

    if (!cardId) {
      return NextResponse.json({ error: 'ID карты не указан' }, { status: 400 })
    }

    // Проверяем что карта существует и активна
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    })

    if (!card || !card.active) {
      return NextResponse.json({ error: 'Карта не найдена или недоступна' }, { status: 404 })
    }

    // Проверяем лимит
    if (card.supplyLimit && card.mintedCount >= card.supplyLimit) {
      return NextResponse.json({ error: 'Карта распродана' }, { status: 400 })
    }

    // Создаём запись в user_cards (покупка)
    const userCard = await prisma.userCard.create({
      data: {
        userId: user.userId,
        cardId: card.id,
        assembledAt: new Date(),
        minted: true,
      },
    })

    // Увеличиваем счётчики
    await prisma.card.update({
      where: { id: card.id },
      data: {
        mintedCount: { increment: 1 },
      },
    })

    await prisma.user.update({
      where: { id: user.userId },
      data: {
        totalCards: { increment: 1 },
      },
    })

    return NextResponse.json({
      success: true,
      userCard: {
        id: userCard.id,
        cardId: userCard.cardId,
        assembledAt: userCard.assembledAt,
      },
      message: 'Карта успешно куплена!',
    })
  } catch (error) {
    console.error('Error purchasing card:', error)
    return NextResponse.json(
      { error: 'Ошибка при покупке карты' },
      { status: 500 }
    )
  }
}
