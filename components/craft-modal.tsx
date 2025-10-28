'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Sparkles, Loader2 } from 'lucide-react'

interface Shard {
  id: string
  fragmentId: string
  shardId: string
  label: string
  name: string
  imageUrl: string
  collectedAt: string
  rarity: string
}

interface CraftModalProps {
  shards: Shard[]
  onClose: () => void
  onSuccess: () => void
}

export function CraftModal({ shards, onClose, onSuccess }: CraftModalProps) {
  const [selectedShards, setSelectedShards] = useState<string[]>([])
  const [isCrafting, setIsCrafting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleShard = (shardId: string) => {
    if (selectedShards.includes(shardId)) {
      setSelectedShards(selectedShards.filter(id => id !== shardId))
    } else if (selectedShards.length < 3) {
      setSelectedShards([...selectedShards, shardId])
    }
  }

  const handleCraft = async () => {
    if (selectedShards.length !== 3) {
      setError('Выберите ровно 3 осколка')
      return
    }

    setIsCrafting(true)
    setError(null)

    try {
      const response = await fetch('/api/craft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shardIds: selectedShards })
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message)
        onSuccess()
        onClose()
      } else {
        setError(data.message || 'Ошибка при создании карты')
      }
    } catch (err) {
      console.error('Craft error:', err)
      setError('Произошла ошибка. Попробуйте снова.')
    } finally {
      setIsCrafting(false)
    }
  }

  // Группируем осколки по типу для удобства
  const shardsByType: Record<string, Shard[]> = {}
  shards.forEach(shard => {
    if (!shardsByType[shard.label]) {
      shardsByType[shard.label] = []
    }
    shardsByType[shard.label].push(shard)
  })

  const hasAllTypes = Object.keys(shardsByType).length >= 3

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Создать NFT карту</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Инструкция */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300 mb-2">📖 Правила крафта:</p>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Выберите ровно 3 осколка</li>
              <li>• Все осколки должны быть РАЗНЫМИ (A + B + C)</li>
              <li>• Все осколки должны быть от ОДНОЙ карты</li>
              <li>• Выбранные осколки исчезнут из инвентаря</li>
            </ul>
          </div>

          {/* Предупреждение если недостаточно осколков */}
          {!hasAllTypes && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-300">
                ⚠️ У вас пока нет всех типов осколков. Для крафта нужны осколки A, B и C.
              </p>
            </div>
          )}

          {/* Счётчик выбранных */}
          <div className="mb-6 text-center">
            <p className="text-lg text-white">
              Выбрано: <span className="font-bold text-blue-400">{selectedShards.length}</span> / 3
            </p>
          </div>

          {/* Сетка осколков */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {shards.map(shard => {
              const isSelected = selectedShards.includes(shard.id)
              const isDisabled = !isSelected && selectedShards.length >= 3

              return (
                <button
                  key={shard.id}
                  onClick={() => toggleShard(shard.id)}
                  disabled={isDisabled}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-500/20 scale-95' 
                      : isDisabled
                        ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                        : 'border-white/20 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 hover:scale-105'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                  
                  <img 
                    src={shard.imageUrl} 
                    alt={shard.name}
                    className="w-full h-24 object-contain mb-2"
                  />
                  
                  <p className="text-sm font-medium text-white text-center">
                    {shard.label}
                  </p>
                  <p className="text-xs text-gray-400 text-center">
                    {shard.name}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Ошибка */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-black/50 flex gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isCrafting}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button
            onClick={handleCraft}
            disabled={selectedShards.length !== 3 || isCrafting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isCrafting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Создание...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Создать карту
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
