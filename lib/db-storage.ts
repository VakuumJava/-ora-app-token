/**
 * Database Storage - замена file-persistence на Prisma
 * Все данные теперь хранятся в PostgreSQL
 */

import { prisma } from './db'

/**
 * Получить все активные spawn points
 */
export async function getActiveSpawnPoints() {
  return await prisma.spawnPoint.findMany({
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
    }
  })
}

/**
 * Создать spawn point
 */
export async function createSpawnPoint(data: {
  shardId: string
  latitude: number
  longitude: number
  radius?: number
  expiresAt?: Date
}) {
  return await prisma.spawnPoint.create({
    data: {
      shardId: data.shardId,
      latitude: data.latitude,
      longitude: data.longitude,
      radius: data.radius || 5,
      expiresAt: data.expiresAt,
      active: true
    },
    include: {
      shard: {
        include: {
          card: true
        }
      }
    }
  })
}

/**
 * Собрать осколок пользователем
 */
export async function collectShard(userId: string, shardId: string) {
  // Создаем запись о собранном осколке
  const userShard = await prisma.userShard.create({
    data: {
      userId,
      shardId,
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

  // Обновляем счетчик у пользователя
  await prisma.user.update({
    where: { id: userId },
    data: {
      totalShards: { increment: 1 }
    }
  })

  return userShard
}

/**
 * Получить инвентарь пользователя
 */
export async function getUserInventory(userId: string) {
  const [shards, cards] = await Promise.all([
    prisma.userShard.findMany({
      where: {
        userId,
        used: false // только неиспользованные
      },
      include: {
        shard: {
          include: {
            card: true
          }
        }
      },
      orderBy: {
        collectedAt: 'desc'
      }
    }),
    prisma.userCard.findMany({
      where: {
        userId,
        minted: false // только не заминченные
      },
      include: {
        card: true
      },
      orderBy: {
        assembledAt: 'desc'
      }
    })
  ])

  return { shards, cards }
}

/**
 * Крафт карты из 3 осколков
 */
export async function craftCard(userId: string, shardIds: string[]) {
  // Получаем осколки
  const userShards = await prisma.userShard.findMany({
    where: {
      id: { in: shardIds },
      userId,
      used: false
    },
    include: {
      shard: true
    }
  })

  if (userShards.length !== 3) {
    throw new Error('Требуется 3 осколка')
  }

  // Проверяем что все осколки от одной карты
  const cardIds = [...new Set(userShards.map(us => us.shard.cardId))]
  if (cardIds.length !== 1) {
    throw new Error('Все осколки должны быть от одной карты')
  }

  const cardId = cardIds[0]

  // Проверяем что есть все 3 типа (A, B, C)
  const labels = userShards.map(us => us.shard.label).sort()
  if (labels.join(',') !== 'A,B,C') {
    throw new Error('Нужны осколки A, B и C')
  }

  // Создаем карту и помечаем осколки как использованные
  const [userCard] = await prisma.$transaction([
    prisma.userCard.create({
      data: {
        userId,
        cardId,
        minted: false
      },
      include: {
        card: true
      }
    }),
    prisma.userShard.updateMany({
      where: {
        id: { in: shardIds }
      },
      data: {
        used: true
      }
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        totalCards: { increment: 1 }
      }
    }),
    prisma.card.update({
      where: { id: cardId },
      data: {
        mintedCount: { increment: 1 }
      }
    })
  ])

  return userCard
}

/**
 * Удалить карту после минта (перенесена в blockchain)
 */
export async function deleteCardAfterMint(userCardId: string, tokenId: string, txHash: string) {
  // Помечаем как заминченную и удаляем из инвентаря
  await prisma.userCard.delete({
    where: { id: userCardId }
  })

  
}

/**
 * Получить или создать пользователя по nickname
 */
export async function getOrCreateUser(nickname: string) {
  let user = await prisma.user.findUnique({
    where: { nickname }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        nickname,
        email: `${nickname}@temp.qora.app`, // Временный email
        passwordHash: 'none', // Пока без пароля
        totalShards: 0,
        totalCards: 0
      }
    })
    
  }

  return user
}

/**
 * Получить статистику пользователя
 */
export async function getUserStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      totalShards: true,
      totalCards: true,
      createdAt: true,
      _count: {
        select: {
          shards: { where: { used: false } },
          cards: { where: { minted: false } }
        }
      }
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  return {
    totalShards: user._count.shards,
    totalCards: user._count.cards,
    daysOnSite: Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
    shardsFound: user.totalShards,
    cardsOwned: user.totalCards
  }
}

/**
 * Передать карту другому пользователю
 */
export async function transferCard(userCardId: string, fromUserId: string, toNickname: string) {
  // Находим получателя
  const toUser = await prisma.user.findUnique({
    where: { nickname: toNickname }
  })

  if (!toUser) {
    throw new Error(`Пользователь @${toNickname} не найден`)
  }

  if (toUser.id === fromUserId) {
    throw new Error('Нельзя передать карту самому себе')
  }

  // Проверяем что карта принадлежит отправителю
  const userCard = await prisma.userCard.findFirst({
    where: {
      id: userCardId,
      userId: fromUserId
    }
  })

  if (!userCard) {
    throw new Error('Карта не найдена в вашем инвентаре')
  }

  // Передаем карту
  await prisma.userCard.update({
    where: { id: userCardId },
    data: {
      userId: toUser.id
    }
  })

  return toUser
}
