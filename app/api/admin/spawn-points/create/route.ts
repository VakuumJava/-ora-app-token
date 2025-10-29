import { NextRequest, NextResponse } from 'next/server'
import { tempSpawnPoints, shardMapping } from '@/lib/spawn-storage'

/**
 * POST /api/admin/spawn-points/create - Создание точки спавна админом
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shardId, latitude, longitude, radius, expiresAt } = body

    if (!shardId || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Shard ID, latitude and longitude are required' },
        { status: 400 }
      )
    }

    // Создаем ID для точки спавна
    const id = `spawn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const spawnPoint = {
      id,
      shardId,
      latitude,
      longitude,
      radius: radius || 5,
      active: true,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdAt: new Date()
    }

    tempSpawnPoints.push(spawnPoint)

    console.log('✅ Точка спавна создана:', spawnPoint)
    console.log('📍 Всего точек:', tempSpawnPoints.length)

    return NextResponse.json({
      success: true,
      spawnPoint: {
        id: spawnPoint.id,
        lat: spawnPoint.latitude,
        lng: spawnPoint.longitude,
        fragment: shardMapping[shardId] || "A",
        radius: spawnPoint.radius,
        active: spawnPoint.active,
        expiresAt: spawnPoint.expiresAt,
        shardId: spawnPoint.shardId
      }
    })
  } catch (error) {
    console.error('Error creating spawn point:', error)
    return NextResponse.json({ error: 'Failed to create spawn point' }, { status: 500 })
  }
}
