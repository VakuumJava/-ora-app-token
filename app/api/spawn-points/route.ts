import { NextRequest, NextResponse } from 'next/server'
import { tempSpawnPoints, shardMapping, shardInfo } from '@/lib/spawn-storage'

/**
 * GET /api/spawn-points - Получение активных точек спавна
 */
export async function GET(request: NextRequest) {
  try {
    // Форматируем точки спавна для фронтенда
    const formattedSpawnPoints = tempSpawnPoints
      .filter(sp => sp.active && (!sp.expiresAt || new Date(sp.expiresAt) > new Date()))
      .map(sp => {
        const shard = shardInfo[sp.shardId as keyof typeof shardInfo]
        return {
          id: sp.id,
          lat: sp.latitude,
          lng: sp.longitude,
          fragment: shard?.label || "A",
          rarity: "rare",
          name: shard?.name || "Осколок",
          available: true,
          radius: sp.radius,
          shardId: sp.shardId,
          imageUrl: shard?.imageUrl || "/elements/shard-1.png"
        }
      })

    return NextResponse.json(formattedSpawnPoints)
  } catch (error) {
    console.error('Error fetching spawn points:', error)
    return NextResponse.json({ error: 'Failed to fetch spawn points' }, { status: 500 })
  }
}