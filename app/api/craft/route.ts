import { NextRequest, NextResponse } from 'next/server'
import { userInventory, userCards, shardInfo, cardInfo } from '@/lib/spawn-storage'

/**
 * POST /api/craft - Скрафтить NFT карту из 3 осколков
 */
export async function POST(request: NextRequest) {
  try {
    const userId = "demo-user" // В реальности это user.userId из JWT
    
    const body = await request.json()
    const { shardIds } = body // Массив из 3 ID осколков для крафта
    
    console.log('🔨 Запрос на крафт:', { userId, shardIds })
    
    if (!shardIds || !Array.isArray(shardIds) || shardIds.length !== 3) {
      return NextResponse.json({
        error: 'Invalid shard IDs',
        message: 'Для крафта нужно выбрать ровно 3 осколка'
      }, { status: 400 })
    }
    
    // Проверяем что все осколки существуют в инвентаре пользователя
    const userShards = userInventory.filter(item => 
      item.userId === userId && shardIds.includes(item.id)
    )
    
    if (userShards.length !== 3) {
      return NextResponse.json({
        error: 'Shards not found',
        message: 'Не все осколки найдены в вашем инвентаре'
      }, { status: 404 })
    }
    
    console.log('📦 Найденные осколки:', userShards)
    
    // Получаем типы осколков (shard-1, shard-2, shard-3)
    const shardTypes = userShards.map(s => s.shardId).sort()
    const uniqueShardTypes = [...new Set(shardTypes)]
    
    console.log('🔍 Типы осколков:', shardTypes)
    console.log('🔍 Уникальные типы:', uniqueShardTypes)
    
    // Проверка 1: Должны быть 3 РАЗНЫХ осколка (A, B, C)
    if (uniqueShardTypes.length !== 3) {
      return NextResponse.json({
        error: 'Invalid shard combination',
        message: '❌ Нужны 3 РАЗНЫХ осколка (A + B + C)! Нельзя дублировать осколки.'
      }, { status: 400 })
    }
    
    // Проверка 2: Все осколки должны быть от одной карты
    const cardIds = userShards.map(s => s.cardId)
    const uniqueCardIds = [...new Set(cardIds)]
    
    console.log('🎴 ID карт:', cardIds)
    console.log('🎴 Уникальные ID карт:', uniqueCardIds)
    
    if (uniqueCardIds.length !== 1) {
      return NextResponse.json({
        error: 'Mixed card shards',
        message: '❌ Все осколки должны быть от одной NFT карты! Нельзя смешивать осколки разных карт.'
      }, { status: 400 })
    }
    
    const cardId = uniqueCardIds[0]
    const card = cardInfo[cardId as keyof typeof cardInfo]
    
    if (!card) {
      return NextResponse.json({
        error: 'Card not found',
        message: 'Информация о карте не найдена'
      }, { status: 404 })
    }
    
    // Проверка 3: Проверяем что это именно нужные осколки для этой карты
    const requiredShards = card.requiredShards.sort()
    const providedShards = shardTypes
    
    const isValidCombination = requiredShards.every((shard, index) => shard === providedShards[index])
    
    if (!isValidCombination) {
      return NextResponse.json({
        error: 'Invalid shard types',
        message: `❌ Для карты "${card.name}" требуются осколки: ${requiredShards.join(', ')}`
      }, { status: 400 })
    }
    
    console.log('✅ Все проверки пройдены! Начинаем крафт...')
    
    // Удаляем использованные осколки из инвентаря
    shardIds.forEach(shardId => {
      const index = userInventory.findIndex(item => item.id === shardId)
      if (index !== -1) {
        userInventory.splice(index, 1)
        console.log(`🗑️ Удален осколок: ${shardId}`)
      }
    })
    
    // Создаём NFT карту
    const craftedCardId = `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const craftedCard = {
      id: craftedCardId,
      userId,
      cardId,
      craftedAt: new Date(),
      usedShardIds: shardIds
    }
    
    userCards.push(craftedCard)
    
    console.log('🎉 NFT карта создана:', craftedCard)
    console.log('📊 Статистика:')
    console.log('  - Осколков осталось:', userInventory.filter(i => i.userId === userId).length)
    console.log('  - Карт собрано:', userCards.filter(c => c.userId === userId).length)
    
    return NextResponse.json({
      success: true,
      message: `🎉 Поздравляем! Вы создали NFT карту "${card.name}"!`,
      card: {
        id: craftedCardId,
        cardId,
        name: card.name,
        description: card.description,
        imageUrl: card.imageUrl,
        rarity: card.rarity,
        craftedAt: craftedCard.craftedAt
      }
    })
    
  } catch (error) {
    console.error('Error during craft:', error)
    return NextResponse.json({ 
      error: 'Failed to craft',
      message: 'Произошла ошибка при создании карты'
    }, { status: 500 })
  }
}
