"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { CosmicBackground } from "@/components/cosmic-background"
import { ParticlesBackground } from "@/components/particles-background"
import { X, Loader2 } from "lucide-react"

interface InventoryData {
  fragments: {
    total: number
    byRarity: {
      common: number
      uncommon: number
      rare: number
      epic: number
      legendary: number
    }
    items: Array<{
      id: string
      fragmentId: string
      name: string
      description: string
      rarity: string
      imageUrl: string
      collectedAt: string
    }>
  }
  cards: {
    total: number
    byRarity: {
      common: number
      uncommon: number
      rare: number
      epic: number
      legendary: number
    }
    items: Array<{
      id: string
      cardId: string
      name: string
      description: string
      rarity: string
      imageUrl: string
      mintedAt: string
      tokenId: string | null
    }>
  }
}

// Конфигурация редкостей
const rarityConfig: Record<string, any> = {
  common: {
    name: "Common",
    label: "Обычный",
    color: "#9CA3AF",
    borderColor: "#9CA3AF",
    glowColor: "156, 163, 175",
    gradient: "linear-gradient(135deg, #9CA3AF 0%, #D1D5DB 100%)",
    image: "/image 17.png",
  },
  uncommon: {
    name: "Uncommon",
    label: "Необычный",
    color: "#3B82F6",
    borderColor: "#3B82F6",
    glowColor: "59, 130, 246",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
    image: "/image 18.png",
  },
  rare: {
    name: "Rare",
    label: "Редкий",
    color: "#10B981",
    borderColor: "#10B981",
    glowColor: "16, 185, 129",
    gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
    image: "/image 19.png",
  },
  epic: {
    name: "Epic",
    label: "Эпический",
    color: "#8B5CF6",
    borderColor: "#8B5CF6",
    glowColor: "139, 92, 246",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
    image: "/image 19.png",
  },
  legendary: {
    name: "Legendary",
    label: "Легендарный",
    color: "#FF8C00",
    borderColor: "#FF8C00",
    glowColor: "255, 140, 0",
    gradient: "linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)",
    image: "/image 20.png",
  },
}

export default function InventoryPage() {
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null)
  const [inventory, setInventory] = useState<InventoryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Для демо пропускаем проверку авторизации
        // Проверяем авторизацию
        // const authResponse = await fetch('/api/auth/me')
        // 
        // if (!authResponse.ok) {
        //   router.push('/login')
        //   return
        // }

        // Загружаем инвентарь
        const inventoryResponse = await fetch('/api/inventory')
        
        if (!inventoryResponse.ok) {
          throw new Error('Ошибка загрузки инвентаря')
        }

        const inventoryData = await inventoryResponse.json()
        console.log('📦 Инвентарь загружен:', inventoryData)
        setInventory(inventoryData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Не удалось загрузить инвентарь')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Загрузка инвентаря...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-white">
            <p className="text-red-400 text-xl mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Подготовка данных для отображения - показываем только редкости с предметами
  const rarityTiers = Object.entries(rarityConfig)
    .map(([key, config]) => ({
      ...config,
      rarity: key,
      count: (inventory?.fragments.byRarity[key as keyof typeof inventory.fragments.byRarity] || 0) +
             (inventory?.cards.byRarity[key as keyof typeof inventory.cards.byRarity] || 0),
    }))
    .filter(tier => tier.count > 0) // Показываем только редкости с предметами

  console.log('📊 Редкости с предметами:', rarityTiers)
  console.log('📦 Всего фрагментов:', inventory?.fragments.total)
  console.log('🎴 Всего карт:', inventory?.cards.total)

  const selectedItems = selectedRarity 
    ? [
        ...(inventory?.fragments.items.filter(item => item.rarity === selectedRarity) || []),
        ...(inventory?.cards.items.filter(item => item.rarity === selectedRarity) || [])
      ]
    : []

  const hasAnyItems = (inventory?.fragments.total || 0) + (inventory?.cards.total || 0) > 0

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <CosmicBackground />
      <ParticlesBackground />

      <SiteHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative z-10 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 text-white/90">
            Здесь хранятся ваши активы
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Всего предметов: {(inventory?.fragments.total || 0) + (inventory?.cards.total || 0)}
          </p>
        </div>
      </section>

      {/* Rarity Cards Grid or Empty State */}
      {hasAnyItems ? (
        <section className="py-16 relative z-10 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {rarityTiers.map((tier) => (
              <div
                key={tier.rarity}
                onClick={() => setSelectedRarity(tier.rarity)}
                className="relative group cursor-pointer transition-all duration-500 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, rgba(${tier.glowColor}, 0.1) 0%, rgba(${tier.glowColor}, 0.05) 100%)`,
                  border: `1px solid rgba(${tier.glowColor}, 0.3)`,
                  boxShadow: `0 0 30px rgba(${tier.glowColor}, 0.2)`,
                }}
              >
                {/* Card Inner */}
                <div className="p-6 rounded-2xl backdrop-blur-sm">
                  {/* Count Badge */}
                  <div
                    className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10"
                    style={{
                      background: tier.gradient,
                      boxShadow: `0 0 20px rgba(${tier.glowColor}, 0.6)`,
                    }}
                  >
                    {tier.count}
                  </div>

                  {/* Rarity Name */}
                  <h3 className="text-2xl font-bold mb-2" style={{ color: tier.color }}>
                    {tier.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{tier.label}</p>

                  {/* Placeholder Image */}
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-4 bg-white/5">
                    {tier.image && (
                      <img
                        src={tier.image}
                        alt={tier.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Stats */}
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between text-gray-400">
                      <span>Осколков:</span>
                      <span className="text-white">{inventory?.fragments.byRarity[tier.rarity as keyof typeof inventory.fragments.byRarity] || 0}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Карт:</span>
                      <span className="text-white">{inventory?.cards.byRarity[tier.rarity as keyof typeof inventory.cards.byRarity] || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `0 0 50px rgba(${tier.glowColor}, 0.4), inset 0 0 50px rgba(${tier.glowColor}, 0.1)`,
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="py-32 relative z-10 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex flex-col items-center justify-center">
              {/* Lottie Animation - используем JSON версию */}
              <div 
                className="w-48 h-48 mb-4"
                dangerouslySetInnerHTML={{
                  __html: `
                    <dotlottie-player
                      src="/LootBag.json"
                      background="transparent"
                      speed="1"
                      style="width: 100%; height: 100%;"
                      loop
                      autoplay
                    ></dotlottie-player>
                  `
                }}
              />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white/90">У вас пока нет предметов</h2>
              <p className="text-lg md:text-xl text-gray-500 mb-8">
                Начните исследовать карту и собирать осколки, чтобы создавать уникальные NFT-карты
              </p>
              <button
                onClick={() => router.push('/map')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 text-white"
              >
                Перейти на карту
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Modal for Viewing Items */}
      {selectedRarity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-6xl w-full bg-gray-900/95 rounded-2xl p-8 max-h-[90vh] overflow-y-auto border border-white/10">
            {/* Close Button */}
            <button
              onClick={() => setSelectedRarity(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <h2 className="text-4xl font-bold mb-8" style={{ color: rarityConfig[selectedRarity].color }}>
              {rarityConfig[selectedRarity].name} - {rarityConfig[selectedRarity].label}
            </h2>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedItems.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition"
                >
                  {item.imageUrl && (
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-4 bg-white/5">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 text-white">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{item.description}</p>
                  <div className="text-xs text-gray-500">
                    {item.collectedAt ? (
                      <p>Собрано: {new Date(item.collectedAt).toLocaleDateString()}</p>
                    ) : (
                      <p>Создано: {new Date(item.mintedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedItems.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                <p>Нет предметов этой редкости</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
