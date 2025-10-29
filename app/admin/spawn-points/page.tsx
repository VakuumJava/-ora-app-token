"use client"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { MapPin, Plus, Trash2, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"

const AdminSpawnMap = dynamic(() => import("@/components/AdminSpawnMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-900">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  )
})

type Fragment = "A" | "B" | "C"

interface Shard {
  id: string
  label: Fragment
  imageUrl: string
  displayName?: string
}

interface SpawnPoint {
  id: string
  lat: number
  lng: number
  fragment: Fragment
  radius: number
  expiresAt?: string
  shardId: string
}

export default function AdminSpawnPointsPage() {
  const [selectedShard, setSelectedShard] = useState<Shard | null>(null)
  const [radius, setRadius] = useState(5)
  const [expiresAt, setExpiresAt] = useState("")
  const [clickLocation, setClickLocation] = useState<[number, number] | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [spawnPoints, setSpawnPoints] = useState<SpawnPoint[]>([])
  const [shards, setShards] = useState<Shard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingShards, setIsLoadingShards] = useState(true)

  useEffect(() => {
    loadSpawnPoints()
    loadShards()
  }, [])

  const loadShards = async () => {
    try {
      const response = await fetch('/api/admin/shards')
      if (response.ok) {
        const data = await response.json()
        // Преобразуем в формат Shard с displayName
        const formattedShards = data.shards.map((s: any) => ({
          id: s.id,
          label: s.label,
          imageUrl: s.cardImage || `/elements/shard-${s.label === 'A' ? '1' : s.label === 'B' ? '2' : '3'}.png`,
          displayName: s.displayName
        }))
        setShards(formattedShards)
      }
    } catch (error) {
      console.error('Error loading shards:', error)
    } finally {
      setIsLoadingShards(false)
    }
  }

  const loadSpawnPoints = async () => {
    try {
      const response = await fetch('/api/spawn-points')
      if (response.ok) {
        const data = await response.json()
        setSpawnPoints(data)
      }
    } catch (error) {
      console.error('Error loading spawn points:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    setClickLocation([lat, lng])
  }

  const createSpawnPoint = async () => {
    if (!selectedShard || !clickLocation) {
      alert("Выберите осколок и кликните на карту")
      return
    }

    setIsCreating(true)

    try {
      const response = await fetch('/api/admin/spawn-points/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shardId: selectedShard.id,
          latitude: clickLocation[0],
          longitude: clickLocation[1],
          radius: radius || 5,
          expiresAt: expiresAt || null
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert("✅ Точка спавна создана!")
        setClickLocation(null)
        setSelectedShard(null)
        setRadius(5)
        setExpiresAt("")
        loadSpawnPoints()
      } else {
        alert(`❌ Ошибка: ${data.error}`)
      }
    } catch (error) {
      alert("❌ Ошибка сети")
      console.error(error)
    } finally {
      setIsCreating(false)
    }
  }

  const deleteSpawnPoint = async (id: string) => {
    if (!confirm("Удалить эту точку спавна?")) return

    try {
      const response = await fetch(`/api/admin/spawn-points/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert("✅ Точка спавна удалена")
        loadSpawnPoints()
      } else {
        alert("❌ Ошибка при удалении")
      }
    } catch (error) {
      alert("❌ Ошибка сети")
      console.error(error)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-black">
      <SiteHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Левая панель */}
        <div className="w-96 border-r border-white/10 bg-gray-950 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-500" />
            Создание точки спавна
          </h1>

          {/* Выбор осколка */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Выберите осколок
            </label>
            {isLoadingShards ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-400">Загрузка осколков...</span>
              </div>
            ) : shards.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Нет доступных осколков. Запустите seed: npx tsx prisma/seed.ts
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {shards.map(shard => (
                  <button
                    key={shard.id}
                    onClick={() => setSelectedShard(shard)}
                    className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedShard?.id === shard.id
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/10 bg-white/5 hover:border-blue-500/50'
                  }`}
                >
                  <img 
                    src={shard.imageUrl} 
                    alt={`Осколок ${shard.label}`}
                    className="w-full h-16 object-contain"
                  />
                  <div className="text-xs text-gray-300 text-center mt-2">
                    {shard.displayName || `Осколок ${shard.label}`}
                  </div>
                  {selectedShard?.id === shard.id && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
            )}
          </div>

          {/* Радиус */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Радиус (метры)
            </label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="5"
              min="1"
              max="100"
            />
          </div>

          {/* Срок действия */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Срок действия (необязательно)
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Выбранное место */}
          {clickLocation && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="text-sm text-blue-300 mb-1">📍 Выбранное место:</div>
              <div className="text-xs text-gray-300 font-mono">
                {clickLocation[0].toFixed(6)}, {clickLocation[1].toFixed(6)}
              </div>
            </div>
          )}

          {/* Кнопка создания */}
          <Button
            onClick={createSpawnPoint}
            disabled={!selectedShard || !clickLocation || isCreating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Создание...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Создать точку спавна
              </>
            )}
          </Button>

          {/* Подсказка */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="text-xs text-yellow-300">
              💡 Кликните на карту справа, чтобы выбрать место для точки спавна
            </div>
          </div>

          {/* Список точек спавна */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              Активные точки ({spawnPoints.length})
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {spawnPoints.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  Нет активных точек спавна
                </div>
              ) : (
                spawnPoints.map(point => (
                  <div
                    key={point.id}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={`/elements/shard-${point.fragment === 'A' ? '1' : point.fragment === 'B' ? '2' : '3'}.png`}
                        alt={`Осколок ${point.fragment}`}
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <div className="text-sm text-white font-medium">
                          Осколок {point.fragment}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteSpawnPoint(point.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition"
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Карта */}
        <div className="flex-1 relative">
          <AdminSpawnMap
            onMapClick={handleMapClick}
            clickLocation={clickLocation}
            spawnPoints={spawnPoints}
          />
        </div>
      </div>
    </div>
  )
}
