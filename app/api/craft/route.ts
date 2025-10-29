import { NextRequest, NextResponse } from 'next/server'
import { userInventory, userCards, shardInfo, cardInfo, cardModels, cardBackgrounds, userProfiles, saveAllData } from '@/lib/spawn-storage'

/**
 * POST /api/craft - Скрафтить NFT карту из 3 осколков
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shardIds, userId: clientUserId } = body // Массив из 3 ID осколков для крафта
    
    // Используем userId из клиента
    const userId = clientUserId || "demo-user"
    
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
    
    // Находим username пользователя
    const userProfile = userProfiles.find(p => p.id === userId)
    const username = userProfile?.username || userId
    
    // Удаляем использованные осколки из инвентаря
    shardIds.forEach(shardId => {
      const index = userInventory.findIndex(item => item.id === shardId)
      if (index !== -1) {
        userInventory.splice(index, 1)
        console.log(`🗑️ Удален осколок: ${shardId}`)
      }
    })
    
    // Создаём NFT карту с рандомными свойствами
    const craftedCardId = `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const randomModel = cardModels[Math.floor(Math.random() * cardModels.length)]
    const randomBackground = cardBackgrounds[Math.floor(Math.random() * cardBackgrounds.length)]
    
    const craftedCard = {
      id: craftedCardId,
      userId,
      cardId,
      craftedAt: new Date(),
      usedShardIds: shardIds,
      model: randomModel,
      background: randomBackground,
      owner: username // Добавляем username владельца
    }
    
    userCards.push(craftedCard)
    
    console.log('🎉 NFT карта создана:', craftedCard)
    console.log('  - Владелец:', username)
    console.log('  - Модель:', randomModel)
    console.log('  - Фон:', randomBackground)
    console.log('📊 Статистика:')
    console.log('  - Осколков осталось:', userInventory.filter(i => i.userId === userId).length)
    console.log('  - Карт собрано:', userCards.filter(c => c.userId === userId).length)
    
    // Сохраняем данные в файл
    saveAllData()
    
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
