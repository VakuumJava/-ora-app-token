import { NextResponse } from 'next/server'
import { userInventory, shardInfo } from '@/lib/spawn-storage'

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
        total: 0,
        byRarity: {
          common: 0,
          uncommon: 0,
          rare: 0,
          epic: 0,
          legendary: 0,
        },
        items: []
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
