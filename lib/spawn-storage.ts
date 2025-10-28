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
