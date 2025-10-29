import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Создаём коллекцию
  const collection = await prisma.collection.upsert({
    where: { id: 'default-collection' },
    update: {},
    create: {
      id: 'default-collection',
      name: 'Qora Collection',
      description: 'Базовая коллекция NFT карточек Qora',
      imageUrl: '/collections/qora.png',
      active: true,
    },
  })

  console.log('✅ Collection created:', collection.name)

  // Создаём ОДНУ карточку
  const card = await prisma.card.upsert({
    where: { id: 'card-qora-main' },
    update: {},
    create: {
      id: 'card-qora-main',
      name: 'Qora Card',
      description: 'Основная карточка Qora NFT',
      rarity: 'rare',
      imageUrl: '/image 17.png',
      supplyLimit: 1000,
      collectionId: collection.id,
    },
  })

  console.log(`✅ Card created: ${card.name}`)

  // Создаём 3 осколка для карточки
  const shardImages = {
    'A': '/elements/shard-1.png',
    'B': '/elements/shard-2.png',
    'C': '/elements/shard-3.png',
  }

  for (const label of ['A', 'B', 'C']) {
    await prisma.shard.upsert({
      where: {
        cardId_label: {
          cardId: card.id,
          label,
        },
      },
      update: {
        imageUrl: shardImages[label as 'A' | 'B' | 'C'],
      },
      create: {
        cardId: card.id,
        label,
        imageUrl: shardImages[label as 'A' | 'B' | 'C'],
      },
    })
  }

  console.log(`✅ Created 3 shards for ${card.name}`)

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
