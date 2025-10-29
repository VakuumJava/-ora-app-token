import { NextRequest, NextResponse } from 'next/server'
import { createSpawnPoint } from '@/lib/db-storage'

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

    // Создаём точку спавна в БД
    const spawnPoint = await createSpawnPoint({
      shardId,
      latitude,
      longitude,
      radius: radius || 5,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    })

    console.log('✅ Точка спавна создана:', spawnPoint)

    return NextResponse.json({
      success: true,
      spawnPoint: {
        id: spawnPoint.id,
        lat: spawnPoint.latitude,
        lng: spawnPoint.longitude,
        radius: spawnPoint.radius,
        active: spawnPoint.active,
        expiresAt: spawnPoint.expiresAt,
        shardId: spawnPoint.shardId
      }
    })
  } catch (error: any) {
    console.error('❌ Ошибка создания точки спавна:', error)
    return NextResponse.json(
      { error: 'Failed to create spawn point', details: error.message },
      { status: 500 }
    )
  }
}
