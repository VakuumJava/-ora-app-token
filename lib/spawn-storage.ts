// Глобальное хранилище точек спавна (серверное)
// Данные хранятся в памяти сервера и синхронизируются с клиентом через API
export const tempSpawnPoints: any[] = []

// Соответствие между ID осколков и лейблами
export const shardMapping: Record<string, string> = {
  "shard-1": "A",
  "shard-2": "B",
  "shard-3": "C",
}

// Информация о NFT картах (для демо - одна карта)
export const cardInfo = {
  "card-1": {
    id: "card-1",
    name: "Легендарная карта Qora",
    description: "Мощная NFT карта из осколков древности",
    imageUrl: "/craftedstone.png", // Реальное изображение карты
    rarity: "legendary" as const,
    requiredShards: ["shard-1", "shard-2", "shard-3"], // Требуется A+B+C
    maxSupply: 2000 // Максимальное количество выпуска
  }
}

// Информация об осколках (теперь с привязкой к карте)
export const shardInfo = {
  "shard-1": {
    label: "A",
    imageUrl: "/elements/shard-1.png",
    name: "Осколок A",
    cardId: "card-1" // К какой карте относится
  },
  "shard-2": {
    label: "B",
    imageUrl: "/elements/shard-2.png",
    name: "Осколок B",
    cardId: "card-1"
  },
  "shard-3": {
    label: "C",
    imageUrl: "/elements/shard-3.png",
    name: "Осколок C",
    cardId: "card-1"
  }
}

// Хранилище инвентаря пользователей (в памяти для демонстрации)
// В реальном приложении это должно быть в БД
export interface CollectedShard {
  id: string // ID записи в инвентаре
  userId: string // ID пользователя (для демо используем "demo-user")
  shardId: string // "shard-1", "shard-2", "shard-3"
  cardId: string // ID карты к которой относится осколок
  spawnPointId: string // ID точки спавна, откуда собран
  collectedAt: Date
}

export const userInventory: CollectedShard[] = []

// Хранилище собранных NFT карт
export interface CollectedCard {
  id: string // ID записи
  userId: string
  cardId: string // ID карты (card-1, card-2, etc)
  craftedAt: Date
  usedShardIds: string[] // ID осколков которые были использованы
  model: string // Рандомная модель
  background: string // Рандомный фон
  mintedOn?: 'ton' | 'ethereum' // На какой сети заминчено
  txHash?: string // Хеш транзакции минта
  tokenId?: string // ID токена в блокчейне
}

export const userCards: CollectedCard[] = []

// Система пользователей
export interface UserProfile {
  id: string
  username: string
  tonWallet?: string
  ethWallet?: string
  createdAt: Date
}

export const userProfiles: UserProfile[] = []

// Рандомные модели и фоны для карт
export const cardModels = ["Hellfire", "Frostbite", "Shadow", "Celestial", "Inferno"]
export const cardBackgrounds = ["Neon Blue", "Dark Purple", "Golden Sunset", "Mystic Green", "Blood Red"]
