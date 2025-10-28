import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getUserFromCookies } from '@/lib/jwt'
import { calculateDistance } from '@/lib/geo-utils'

/**
 * POST /api/checkin - Чекин пользователя на точке спавна
 */
export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const user = await getUserFromCookies()
    if (!user || !user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { spawnPointId, userLat, userLng, accuracy } = body

    if (!spawnPointId || userLat === undefined || userLng === undefined) {
      return NextResponse.json(
        { error: 'Spawn point ID and user coordinates are required' },
        { status: 400 }
      )
    }

    // Получаем точку спавна
    const spawnPoint = await prisma.spawnPoint.findUnique({
      where: { id: spawnPointId },
      include: {
        shard: {
          include: {
            card: true
          }
        }
      }
    })

    if (!spawnPoint) {
      return NextResponse.json({ error: 'Spawn point not found' }, { status: 404 })
    }

    // Проверяем активность
    if (!spawnPoint.active) {
      return NextResponse.json({ error: 'Spawn point is not active' }, { status: 400 })
    }

    // Проверяем срок действия
    if (spawnPoint.expiresAt && spawnPoint.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Spawn point has expired' }, { status: 400 })
    }

    // Вычисляем расстояние между пользователем и точкой спавна
    const distance = calculateDistance(
      userLat,
      userLng,
      spawnPoint.latitude,
      spawnPoint.longitude
    )

    // Проверяем радиус (по умолчанию 5 метров)
    const requiredRadius = spawnPoint.radius || 5
    if (distance > requiredRadius) {
      return NextResponse.json({
        error: 'Too far from spawn point',
        distance,
        requiredRadius,
        message: `Вы находитесь в ${Math.round(distance)}м от точки. Подойдите ближе (требуется ${requiredRadius}м).`
      }, { status: 400 })
    }

    // Проверяем точность GPS
    if (accuracy && accuracy > 50) {
      return NextResponse.json({
        error: 'GPS accuracy too low',
        accuracy,
        message: 'Точность GPS слишком низкая. Попробуйте выйти на открытое пространство.'
      }, { status: 400 })
    }

    // Проверяем, не собирал ли пользователь уже этот осколок
    const existingShard = await prisma.userShard.findFirst({
      where: {
        userId: user.userId,
        shardId: spawnPoint.shardId,
        used: false
      }
    })

    if (existingShard) {
      return NextResponse.json({
        error: 'Already collected',
        message: 'Вы уже собрали этот осколок'
      }, { status: 400 })
    }

    // Добавляем осколок в инвентарь пользователя
    const userShard = await prisma.userShard.create({
      data: {
        userId: user.userId,
        shardId: spawnPoint.shardId,
        collectedAt: new Date(),
        used: false
      },
      include: {
        shard: {
          include: {
            card: true
          }
        }
      }
    })

    // Обновляем счетчик осколков у пользователя
    await prisma.user.update({
      where: { id: user.userId },
      data: {
        totalShards: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Осколок успешно собран!',
      shard: {
        id: userShard.id,
        label: userShard.shard.label,
        cardName: userShard.shard.card.name,
        imageUrl: userShard.shard.imageUrl,
        collectedAt: userShard.collectedAt
      }
    })
  } catch (error) {
    console.error('Error during checkin:', error)
    return NextResponse.json({ error: 'Failed to checkin' }, { status: 500 })
  }
}
