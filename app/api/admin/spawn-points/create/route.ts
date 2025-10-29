import { NextRequest, NextResponse } from 'next/server'
import { createSpawnPoint } from '@/lib/db-storage'
import { prisma } from '@/lib/db'

/**
 * POST /api/admin/spawn-points/create - Создание точки спавна админом
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shardId, latitude, longitude, radius, expiresAt } = body

    console.log('📍 Создание spawn point:', { shardId, latitude, longitude, radius })

    if (!shardId || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Shard ID, latitude and longitude are required' },
        { status: 400 }
      )
    }

    // Проверяем что shard существует
    const shard = await prisma.shard.findUnique({
      where: { id: shardId },
      include: { card: true }
    })

    if (!shard) {
      console.error('❌ Shard не найден:', shardId)
      return NextResponse.json(
        { error: `Shard with ID ${shardId} not found in database` },
        { status: 404 }
      )
    }

    console.log('✅ Shard найден:', shard.label, 'для карты:', shard.card.name)

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
        shardId: spawnPoint.shardId,
        shard: {
          label: shard.label,
          cardName: shard.card.name
        }
      }
    })
  } catch (error: any) {
    console.error('❌ Ошибка создания точки спавна:', error)
    console.error('Stack:', error.stack)
    
    return NextResponse.json(
      { 
        error: 'Failed to create spawn point', 
        details: error.message,
        code: error.code 
      },
      { status: 500 }
    )
  }
}
