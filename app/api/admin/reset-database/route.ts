import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Очистка базы данных и пересоздание только 1 карточки + 3 осколков
 * POST /api/admin/reset-database
 * ВАЖНО: Использовать только для очистки старых данных!
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🗑️  Начинаем очистку базы данных...')

    // 1. Удаляем собранные осколки пользователями
    await prisma.userShard.deleteMany({})
    console.log('✅ UserShards удалены')

    // 2. Удаляем созданные карточки пользователями
    await prisma.userCard.deleteMany({})
    console.log('✅ UserCards удалены')

    // 3. Удаляем spawn points
    await prisma.spawnPoint.deleteMany({})
    console.log('✅ SpawnPoints удалены')

    // 4. Удаляем осколки
    await prisma.shard.deleteMany({})
    console.log('✅ Shards удалены')

    // 5. Удаляем карточки
    await prisma.card.deleteMany({})
    console.log('✅ Cards удалены')

    // 6. Удаляем коллекции
    await prisma.collection.deleteMany({})
    console.log('✅ Collections удалены')

    console.log('🌱 Создаём новые данные...')

    // Создаём коллекцию
    const collection = await prisma.collection.create({
      data: {
        id: 'default-collection',
        name: 'Qora Collection',
        description: 'Базовая коллекция NFT карточек Qora',
        imageUrl: '/collections/qora.png',
        active: true,
      }
    })

    // Создаём ОДНУ карточку
    const card = await prisma.card.create({
      data: {
        id: 'card-qora-main',
        name: 'Qora Card',
        description: 'Основная карточка Qora NFT',
        rarity: 'rare',
        imageUrl: '/image 17.png',
        supplyLimit: 1000,
        collectionId: collection.id,
      }
    })

    // Создаём 3 осколка
    const shardImages = {
      'A': '/elements/shard-1.png',
      'B': '/elements/shard-2.png',
      'C': '/elements/shard-3.png',
    }

    for (const label of ['A', 'B', 'C']) {
      await prisma.shard.create({
        data: {
          cardId: card.id,
          label,
          imageUrl: shardImages[label as 'A' | 'B' | 'C'],
        }
      })
    }

    console.log('✨ База данных успешно очищена и пересоздана!')

    return NextResponse.json({
      success: true,
      message: '✅ База очищена. Создано: 1 карточка "Qora Card" + 3 осколка (A, B, C)',
      data: {
        collection: collection.name,
        card: card.name,
        shards: 3
      }
    })

  } catch (error: any) {
    console.error('❌ Ошибка очистки базы:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Ошибка очистки базы данных', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}
