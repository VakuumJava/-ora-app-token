import { NextResponse } from 'next/server'
import { userInventory, shardInfo, userCards, cardInfo } from '@/lib/spawn-storage'

/**
 * GET /api/inventory
 * Получает инвентарь пользователя: фрагменты и карты (упрощенная демо-версия)
 */
export async function GET() {
  try {
    // Для демо используем упрощенную версию с in-memory хранилищем
    const userId = "demo-user" // В реальности это user.userId из JWT
    
    // Получаем осколки из временного хранилища
    const userShards = userInventory.filter(item => item.userId === userId)
    
    // Обогащаем данные информацией об осколках
    const enrichedShards = userShards.map(item => {
      const shard = shardInfo[item.shardId as keyof typeof shardInfo]
      return {
        id: item.id,
        fragmentId: item.shardId,
        shardId: item.shardId,
        label: shard?.label || "?",
        name: shard?.name || "Неизвестный осколок",
        imageUrl: shard?.imageUrl || "",
        collectedAt: item.collectedAt,
        spawnPointId: item.spawnPointId,
        rarity: "common" as const
      }
    })
    
    console.log(`📦 Запрос инвентаря для ${userId}: ${enrichedShards.length} осколков`)
    
    // Получаем NFT карты из временного хранилища
    const userNFTCards = userCards.filter(item => item.userId === userId)
    
    // Обогащаем данные информацией о картах
    const enrichedCards = userNFTCards.map(item => {
      const card = cardInfo[item.cardId as keyof typeof cardInfo]
      return {
        id: item.id,
        cardId: item.cardId,
        name: card?.name || "Неизвестная карта",
        description: card?.description || "",
        imageUrl: card?.imageUrl || "",
        rarity: card?.rarity || "common",
        craftedAt: item.craftedAt,
        usedShardIds: item.usedShardIds,
        model: item.model,
        background: item.background,
        owner: userId // Добавляем владельца
      }
    })
    
    console.log(`🎴 Карт у пользователя: ${enrichedCards.length}`)
    
    // Подсчитываем карты по редкости
    const cardsByRarity = {
      common: enrichedCards.filter(c => (c.rarity as string) === 'common').length,
      uncommon: enrichedCards.filter(c => (c.rarity as string) === 'uncommon').length,
      rare: enrichedCards.filter(c => (c.rarity as string) === 'rare').length,
      epic: enrichedCards.filter(c => (c.rarity as string) === 'epic').length,
      legendary: enrichedCards.filter(c => (c.rarity as string) === 'legendary').length,
    }
    
    // Возвращаем структуру совместимую со старым API
    return NextResponse.json({
      fragments: {
        total: enrichedShards.length,
        byRarity: {
          common: enrichedShards.length,
          uncommon: 0,
          rare: 0,
          epic: 0,
          legendary: 0,
        },
        items: enrichedShards
      },
      cards: {
        total: enrichedCards.length,
        byRarity: cardsByRarity,
        items: enrichedCards
      }
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки инвентаря' },
      { status: 500 }
    )
  }
}
