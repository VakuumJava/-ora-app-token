import { loadPersistedData, savePersistedData, startAutoSave, type PersistedData } from './file-persistence'

// Глобальное хранилище точек спавна (серверное)
// Данные хранятся в памяти сервера и синхронизируются с клиентом через API
export const tempSpawnPoints: any[] = []

// Загружаем данные из файла при старте сервера
const persistedData = loadPersistedData()
if (persistedData) {
  tempSpawnPoints.push(...persistedData.spawnPoints)
  console.log('📦 Загружено spawn points:', tempSpawnPoints.length)
}

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
if (persistedData) {
  userInventory.push(...persistedData.userInventory.map((s: any) => ({
    ...s,
    collectedAt: new Date(s.collectedAt)
  })))
  console.log('📦 Загружено осколков:', userInventory.length)
}

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
  mintedAt?: Date // Дата минта
  chain?: string // Цепь (ton/eth)
  owner?: string // Username владельца
}

export const userCards: CollectedCard[] = []
if (persistedData) {
  userCards.push(...persistedData.userCards.map((c: any) => ({
    ...c,
    craftedAt: new Date(c.craftedAt),
    mintedAt: c.mintedAt ? new Date(c.mintedAt) : undefined
  })))
  console.log('🎴 Загружено карт:', userCards.length)
}

// Система пользователей
export interface UserProfile {
  id: string
  username: string
  tonWallet?: string
  ethWallet?: string
  createdAt: Date
}

export const userProfiles: UserProfile[] = []
if (persistedData) {
  userProfiles.push(...persistedData.userProfiles.map((p: any) => ({
    ...p,
    createdAt: new Date(p.createdAt)
  })))
  console.log('👤 Загружено пользователей:', userProfiles.length)
}

// Рандомные модели и фоны для карт
export const cardModels = ["Hellfire", "Frostbite", "Shadow", "Celestial", "Inferno"]
export const cardBackgrounds = ["Neon Blue", "Dark Purple", "Golden Sunset", "Mystic Green", "Blood Red"]

/**
 * Сохраняет все данные в файл
 */
export function saveAllData() {
  const data: PersistedData = {
    spawnPoints: tempSpawnPoints,
    userInventory,
    userCards,
    userProfiles,
    lastSaved: new Date().toISOString()
  }
  return savePersistedData(data)
}

/**
 * Запускает автосохранение каждые 5 минут
 */
if (typeof window === 'undefined') {
  // Только на сервере
  startAutoSave(() => ({
    spawnPoints: tempSpawnPoints,
    userInventory,
    userCards,
    userProfiles,
    lastSaved: new Date().toISOString()
  }), 5)
  
  console.log('✅ Система персистентности запущена')
}
