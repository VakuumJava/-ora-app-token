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

  // Создаём карточки разных редкостей
  const cards = [
    {
      id: 'card-common-1',
      name: 'Каменная Пирамида',
      description: 'Древний артефакт с загадочными символами',
      rarity: 'common',
      imageUrl: '/image 17.png',
      supplyLimit: 1000,
    },
    {
      id: 'card-uncommon-1',
      name: 'Кристальное Дерево',
      description: 'Редкий предмет, найденный в различных локациях',
      rarity: 'uncommon',
      imageUrl: '/image 18.png',
      supplyLimit: 500,
    },
    {
      id: 'card-rare-1',
      name: 'Изумрудная Сфера',
      description: 'Ценный артефакт с особыми свойствами',
      rarity: 'rare',
      imageUrl: '/image 19.png',
      supplyLimit: 200,
    },
    {
      id: 'card-epic-1',
      name: 'Золотой Дракон',
      description: 'Эпический предмет невероятной силы',
      rarity: 'epic',
      imageUrl: '/image 19.png',
      supplyLimit: 50,
    },
    {
      id: 'card-legendary-1',
      name: 'Корона Судьбы',
      description: 'Легендарное сокровище невероятной редкости',
      rarity: 'legendary',
      imageUrl: '/image 20.png',
      supplyLimit: 10,
    },
  ]

  for (const cardData of cards) {
    const card = await prisma.card.upsert({
      where: { id: cardData.id },
      update: {},
      create: {
        ...cardData,
        collectionId: collection.id,
      },
    })

    console.log(`✅ Card created: ${card.name} (${card.rarity})`)

    // Создаём 3 осколка для каждой карточки
    for (const label of ['A', 'B', 'C']) {
      await prisma.shard.upsert({
        where: {
          cardId_label: {
            cardId: card.id,
            label,
          },
        },
        update: {},
        create: {
          cardId: card.id,
          label,
          imageUrl: cardData.imageUrl,
        },
      })
    }

    console.log(`  ✅ Created 3 shards for ${card.name}`)
  }

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
