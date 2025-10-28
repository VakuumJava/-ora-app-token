"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { MapPin, Plus, Trash2 } from "lucide-react"
import dynamic from "next/dynamic"

const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-black">Загрузка карты...</div>
})

interface Shard {
  id: string
  label: string
  imageUrl: string
  card: {
    id: string
    name: string
    rarity: string
  }
}

export default function AdminSpawnPointsPage() {
  const [shards, setShards] = useState<Shard[]>([])
  const [selectedShard, setSelectedShard] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = useState(5)
  const [expiresAt, setExpiresAt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadShards()
  }, [])

  async function loadShards() {
    try {
      const response = await fetch('/api/admin/shards')
      if (response.ok) {
        const data = await response.json()
        setShards(data)
      }
    } catch (error) {
      console.error('Error loading shards:', error)
    }
  }

  async function handleCreateSpawnPoint() {
    if (!selectedShard || !selectedLocation) {
      setMessage("Выберите осколок и место на карте")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch('/api/admin/spawn-points/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shardId: selectedShard,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          radius,
          expiresAt: expiresAt || null
        })
      })

      if (response.ok) {
        setMessage("✅ Точка спавна успешно создана!")
        setSelectedLocation(null)
        setSelectedShard("")
        setExpiresAt("")
      } else {
        const error = await response.json()
        setMessage(`❌ Ошибка: ${error.error}`)
      }
    } catch (error) {
      setMessage("❌ Ошибка сети")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-black">
      <SiteHeader />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Боковая панель */}
        <div className="w-96 border-r border-white/10 bg-black/50 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Управление точками спавна
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Выберите осколок
              </label>
              <select
                value={selectedShard}
                onChange={(e) => setSelectedShard(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Выбрать --</option>
                {shards.map((shard) => (
                  <option key={shard.id} value={shard.id} className="bg-black">
                    {shard.card.name} - Осколок {shard.label} ({shard.card.rarity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Радиус (метры)
              </label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                min="1"
                max="100"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Срок действия (необязательно)
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {selectedLocation && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-300">
                  📍 Выбрано место:
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            )}

            <Button
              onClick={handleCreateSpawnPoint}
              disabled={isLoading || !selectedShard || !selectedLocation}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Создание...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать точку спавна
                </>
              )}
            </Button>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.startsWith('✅') 
                  ? 'bg-green-500/10 border border-green-500/30 text-green-300' 
                  : 'bg-red-500/10 border border-red-500/30 text-red-300'
              }`}>
                {message}
              </div>
            )}

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-gray-400">
                💡 Кликните на карту справа, чтобы выбрать место для точки спавна
              </p>
            </div>
          </div>
        </div>

        {/* Карта */}
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            {/* TODO: Добавить интерактивную карту с возможностью клика */}
            <div className="flex items-center justify-center h-full bg-gray-900 text-gray-500">
              <p>Карта с возможностью выбора места (в разработке)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
