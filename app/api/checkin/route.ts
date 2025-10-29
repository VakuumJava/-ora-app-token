import { NextRequest, NextResponse } from 'next/server'
import { calculateDistance } from '@/lib/geo-utils'
import { collectShard, getOrCreateUser } from '@/lib/db-storage'
import { prisma } from '@/lib/db'

/**
 * POST /api/checkin - Собрать осколок с точки спавна
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { spawnPointId, userLat, userLng, userId: userNickname } = body

    console.log('📍 Checkin request:', { spawnPointId, userLat, userLng, userNickname })

    if (!spawnPointId || !userLat || !userLng || !userNickname) {
      return NextResponse.json({
        error: 'Missing parameters',
        message: 'Укажите все параметры'
      }, { status: 400 })
    }

    // Получаем или создаем пользователя
    const user = await getOrCreateUser(userNickname)

    // Находим spawn point
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
      return NextResponse.json({
        error: 'Spawn point not found',
        message: 'Точка спавна не найдена'
      }, { status: 404 })
    }

    if (!spawnPoint.active) {
      return NextResponse.json({
        error: 'Spawn point inactive',
        message: 'Эта точка спавна больше не активна'
      }, { status: 400 })
    }

    // Проверяем не истек ли срок
    if (spawnPoint.expiresAt && spawnPoint.expiresAt < new Date()) {
      return NextResponse.json({
        error: 'Spawn point expired',
        message: 'Срок действия этой точки истек'
      }, { status: 400 })
    }

    // Проверяем не собирал ли уже этот пользователь с этой точки
    const alreadyCollected = await prisma.userShard.findFirst({
      where: {
        userId: user.id,
        shardId: spawnPoint.shardId
      }
    })

    // Вычисляем расстояние
    const distance = calculateDistance(
      userLat,
      userLng,
      spawnPoint.latitude,
      spawnPoint.longitude
    )

    console.log(`📏 Расстояние: ${distance.toFixed(2)}м, требуется: ${spawnPoint.radius}м`)

    if (distance > spawnPoint.radius) {
      return NextResponse.json({
        error: 'Too far',
        message: `Вы слишком далеко! Подойдите ближе на ${Math.ceil(distance - spawnPoint.radius)}м`
      }, { status: 400 })
    }

    // Собираем осколок
    const userShard = await collectShard(user.id, spawnPoint.shardId)

    console.log('✅ Осколок собран:', userShard.id)

    return NextResponse.json({
      success: true,
      message: '�� Осколок успешно собран!',
      shard: {
        id: userShard.id,
        label: userShard.shard.label,
        cardName: userShard.shard.card.name,
        imageUrl: userShard.shard.imageUrl,
        collectedAt: userShard.collectedAt
      }
    })

  } catch (error: any) {
    console.error('❌ Checkin error:', error)
    return NextResponse.json({
      error: 'Internal error',
      message: error.message || 'Произошла ошибка'
    }, { status: 500 })
  }
}
