// Глобальное хранилище точек спавна (в памяти для демонстрации)
export const tempSpawnPoints: any[] = []

// Соответствие между ID осколков и лейблами
export const shardMapping: Record<string, string> = {
  "shard-1": "A",
  "shard-2": "B",
  "shard-3": "C",
}

// Информация об осколках
export const shardInfo = {
  "shard-1": {
    label: "A",
    imageUrl: "/elements/shard-1.png",
    name: "Осколок A"
  },
  "shard-2": {
    label: "B",
    imageUrl: "/elements/shard-2.png",
    name: "Осколок B"
  },
  "shard-3": {
    label: "C",
    imageUrl: "/elements/shard-3.png",
    name: "Осколок C"
  }
}

// Хранилище инвентаря пользователей (в памяти для демонстрации)
// В реальном приложении это должно быть в БД
export interface CollectedShard {
  id: string // ID записи в инвентаре
  userId: string // ID пользователя (для демо используем "demo-user")
  shardId: string // "shard-1", "shard-2", "shard-3"
  spawnPointId: string // ID точки спавна, откуда собран
  collectedAt: Date
}

export const userInventory: CollectedShard[] = []
