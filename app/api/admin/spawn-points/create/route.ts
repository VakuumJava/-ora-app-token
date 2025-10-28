import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getUserFromCookies } from '@/lib/jwt'

/**
 * POST /api/admin/spawn-points/create - Создание точки спавна админом
 */
export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const user = await getUserFromCookies()
    if (!user || !user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Проверяем админ права
    const adminRole = await prisma.adminRole.findUnique({
      where: { userId: user.userId }
    })

    if (!adminRole) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { shardId, latitude, longitude, radius, expiresAt } = body

    if (!shardId || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Shard ID, latitude and longitude are required' },
        { status: 400 }
      )
    }

    // Проверяем существование осколка
    const shard = await prisma.shard.findUnique({
      where: { id: shardId },
      include: { card: true }
    })

    if (!shard) {
      return NextResponse.json({ error: 'Shard not found' }, { status: 404 })
    }

    // Создаем точку спавна
    const spawnPoint = await prisma.spawnPoint.create({
      data: {
        shardId,
        latitude,
        longitude,
        radius: radius || 5,
        active: true,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      },
      include: {
        shard: {
          include: {
            card: true
          }
        }
      }
    })

    // Логируем действие админа
    await prisma.auditLog.create({
      data: {
        adminId: user.userId,
        action: 'create_spawn_point',
        entity: 'spawn_points',
        entityId: spawnPoint.id,
        after: JSON.stringify({
          id: spawnPoint.id,
          shardId,
          latitude,
          longitude,
          radius: spawnPoint.radius
        })
      }
    })

    return NextResponse.json({
      success: true,
      spawnPoint: {
        id: spawnPoint.id,
        lat: spawnPoint.latitude,
        lng: spawnPoint.longitude,
        fragment: spawnPoint.shard.label,
        rarity: spawnPoint.shard.card.rarity,
        name: spawnPoint.shard.card.name,
        radius: spawnPoint.radius,
        active: spawnPoint.active,
        expiresAt: spawnPoint.expiresAt
      }
    })
  } catch (error) {
    console.error('Error creating spawn point:', error)
    return NextResponse.json({ error: 'Failed to create spawn point' }, { status: 500 })
  }
}
