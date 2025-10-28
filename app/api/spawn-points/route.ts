import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

/**
 * GET /api/spawn-points - Получение активных точек спавна
 */
export async function GET(request: NextRequest) {
  try {
    const spawnPoints = await prisma.spawnPoint.findMany({
      where: {
        active: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        shard: {
          include: {
            card: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Преобразуем в формат для фронтенда
    const formattedSpawnPoints = spawnPoints.map(sp => ({
      id: sp.id,
      lat: sp.latitude,
      lng: sp.longitude,
      fragment: sp.shard.label, // A, B, C
      rarity: sp.shard.card.rarity,
      name: sp.shard.card.name,
      available: true,
      radius: sp.radius,
      shardId: sp.shardId,
      imageUrl: sp.shard.imageUrl
    }))

    return NextResponse.json(formattedSpawnPoints)
  } catch (error) {
    console.error('Error fetching spawn points:', error)
    return NextResponse.json({ error: 'Failed to fetch spawn points' }, { status: 500 })
  }
}
