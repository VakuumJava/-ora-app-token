/**
 * Prisma Query Optimization Utilities
 * Prevents N+1 queries and optimizes data fetching
 */

/**
 * Standard include patterns to prevent N+1 queries
 */
export const PRISMA_INCLUDES = {
  userCard: {
    include: {
      card: true,
      user: {
        select: {
          id: true,
          email: true,
          nickname: true,
        },
      },
    },
  },

  userShard: {
    include: {
      shard: {
        include: {
          card: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          nickname: true,
        },
      },
    },
  },

  spawnPoint: {
    include: {
      shard: {
        include: {
          card: true,
        },
      },
    },
  },

  card: {
    include: {
      collection: true,
    },
  },

  user: {
    include: {
      userCards: {
        include: {
          card: true,
        },
      },
      userShards: {
        include: {
          shard: {
            include: {
              card: true,
            },
          },
        },
      },
    },
  },

  collection: {
    include: {
      cards: true,
    },
  },
};

/**
 * Batch load related records to avoid N+1
 * @example
 * const users = await prisma.user.findMany();
 * const enriched = await batchLoadUserCards(users);
 */
export async function batchLoadUserCards(
  prisma: any,
  userIds: string[]
) {
  if (userIds.length === 0) return new Map();

  const cards = await prisma.userCard.findMany({
    where: { userId: { in: userIds } },
    include: { card: true },
  });

  const map = new Map<string, typeof cards>();
  for (const card of cards) {
    const existing = map.get(card.userId) || [];
    existing.push(card);
    map.set(card.userId, existing);
  }

  return map;
}

/**
 * Batch load user shards to avoid N+1
 */
export async function batchLoadUserShards(
  prisma: any,
  userIds: string[]
) {
  if (userIds.length === 0) return new Map();

  const shards = await prisma.userShard.findMany({
    where: { userId: { in: userIds } },
    include: { shard: { include: { card: true } } },
  });

  const map = new Map<string, typeof shards>();
  for (const shard of shards) {
    const existing = map.get(shard.userId) || [];
    existing.push(shard);
    map.set(shard.userId, existing);
  }

  return map;
}

/**
 * Count records efficiently
 */
export async function countRecords(
  prisma: any,
  model: string,
  where?: any
) {
  return prisma[model].count({ where });
}

/**
 * Paginate records efficiently
 */
export async function paginate<T>(
  query: Promise<T[]>,
  countQuery: Promise<number>,
  page: number = 1,
  pageSize: number = 10
) {
  const [data, total] = await Promise.all([query, countQuery]);

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
      hasNext: page < Math.ceil(total / pageSize),
      hasPrev: page > 1,
    },
  };
}
