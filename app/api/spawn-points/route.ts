import { NextRequest, NextResponse } from 'next/server'
import { getActiveSpawnPoints } from '@/lib/db-storage'

/**
 * GET /api/spawn-points - Получение активных точек спавна
 */
export async function GET(request: NextRequest) {
  try {
    const spawnPoints = await getActiveSpawnPoints()

    // Форматируем для фронтенда
    const formattedSpawnPoints = spawnPoints.map(sp => ({
      id: sp.id,
      lat: sp.latitude,
      lng: sp.longitude,
      fragment: sp.shard.label,
      rarity: sp.shard.card.rarity.toLowerCase(),
      name: `Осколок ${sp.shard.label}`,
      available: true,
      radius: sp.radius,
      shardId: sp.shard.id,
      imageUrl: sp.shard.imageUrl
    }))

    return NextResponse.json(formattedSpawnPoints)
  } catch (error) {
    console.error('Error fetching spawn points:', error)
    return NextResponse.json({ error: 'Failed to fetch spawn points' }, { status: 500 })
  }
}
