import { NextRequest, NextResponse } from 'next/server'
import { getUserFromCookies } from '@/lib/jwt'
import { calculateDistance } from '@/lib/geo-utils'
import { tempSpawnPoints, shardInfo } from '@/lib/spawn-storage'

/**
 * POST /api/checkin - Чекин пользователя на точке спавна
 */
export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию (пока без реальной проверки для демо)
    // const user = await getUserFromCookies()
    // if (!user || !user.userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const { spawnPointId, userLat, userLng, accuracy } = body

    console.log('🎯 Чекин запрос:', { spawnPointId, userLat, userLng })

    if (!spawnPointId || userLat === undefined || userLng === undefined) {
      return NextResponse.json(
        { error: 'Spawn point ID and user coordinates are required' },
        { status: 400 }
      )
    }

    // Получаем точку спавна из временного хранилища
    const spawnPoint = tempSpawnPoints.find((sp: any) => sp.id === spawnPointId)

    console.log('📍 Найдена точка спавна:', spawnPoint)
    console.log('📦 Всего точек в хранилище:', tempSpawnPoints.length)

    if (!spawnPoint) {
      return NextResponse.json({ 
        error: 'Spawn point not found',
        message: 'Точка спавна не найдена. Возможно, она была удалена.'
      }, { status: 404 })
    }

    // Проверяем активность
    if (!spawnPoint.active) {
      return NextResponse.json({ 
        error: 'Spawn point is not active',
        message: 'Эта точка спавна неактивна'
      }, { status: 400 })
    }

    // Проверяем срок действия
    if (spawnPoint.expiresAt && new Date(spawnPoint.expiresAt) < new Date()) {
      return NextResponse.json({ 
        error: 'Spawn point has expired',
        message: 'Срок действия этой точки истек'
      }, { status: 400 })
    }

    // Вычисляем расстояние между пользователем и точкой спавна
    const distance = calculateDistance(
      userLat,
      userLng,
      spawnPoint.latitude,
      spawnPoint.longitude
    )

    console.log(`📏 Расстояние: ${distance.toFixed(2)}м, требуется: ${spawnPoint.radius || 5}м`)

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

    // Получаем информацию об осколке
    const shard = shardInfo[spawnPoint.shardId as keyof typeof shardInfo]
    
    if (!shard) {
      return NextResponse.json({ 
        error: 'Shard not found',
        message: 'Информация об осколке не найдена'
      }, { status: 404 })
    }

    console.log('✅ Чекин успешен! Осколок:', shard.label)

    // Возвращаем успешный результат (без сохранения в БД для демо)
    return NextResponse.json({
      success: true,
      message: '🎉 Осколок успешно собран!',
      shard: {
        id: spawnPoint.id,
        label: shard.label,
        cardName: shard.name,
        imageUrl: shard.imageUrl,
        collectedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Error during checkin:', error)
    return NextResponse.json({ error: 'Failed to checkin' }, { status: 500 })
  }
}
