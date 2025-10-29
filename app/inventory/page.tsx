"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { CosmicBackground } from "@/components/cosmic-background"
import { ParticlesBackground } from "@/components/particles-background"
import { CraftModal } from "@/components/craft-modal"
import { CardDetailsModal } from "@/components/card-details-modal"
import { X, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUserSession } from "@/lib/user-session"

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
  const [showCraftModal, setShowCraftModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'fragments' | 'cards'>('fragments')
  const [selectedCard, setSelectedCard] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Получаем текущую сессию пользователя
        const session = getUserSession()
        console.log('👤 Текущий пользователь:', session.userId)

        // Загружаем инвентарь с userId
        const inventoryResponse = await fetch(`/api/inventory?userId=${session.userId}`)
        
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
  const hasFragments = (inventory?.fragments.total || 0) > 0
  const hasCards = (inventory?.cards.total || 0) > 0

  // Обработчик успешного крафта
  const handleCraftSuccess = () => {
    // Перезагружаем инвентарь
    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => {
        console.log('📦 Инвентарь перезагружен после крафта:', data)
        setInventory(data)
      })
      .catch(console.error)
  }

  // Обработчик передачи карты
  const handleTransfer = async (username: string) => {
    if (!selectedCard) return

    const response = await fetch('/api/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardId: selectedCard.id,
        recipientUsername: username
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка при передаче')
    }

    alert(data.message)
    
    // Перезагружаем инвентарь
    handleCraftSuccess()
  }

  // Обработчик минта NFT
  const handleMint = async (chain: 'ton' | 'eth') => {
    // Проверяем наличие подключенного кошелька
    if (chain === 'ton') {
      // TODO: Проверить подключение TonConnect
      alert('Функция минта на TON будет доступна после подключения кошелька')
      throw new Error('TON wallet not connected')
    } else {
      // TODO: Проверить подключение Web3/MetaMask
      alert('Функция минта на Ethereum будет доступна после подключения кошелька')
      throw new Error('ETH wallet not connected')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <CosmicBackground />
      <ParticlesBackground />

      <SiteHeader />

      {/* Craft Modal */}
      {showCraftModal && inventory?.fragments.items && (
        <CraftModal
          shards={inventory.fragments.items as any}
          onClose={() => setShowCraftModal(false)}
          onSuccess={handleCraftSuccess}
        />
      )}

      {/* Card Details Modal */}
      {selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          totalMinted={inventory?.cards.total || 0}
          maxSupply={2000}
          floorPrice={null}
          onClose={() => setSelectedCard(null)}
          onTransfer={handleTransfer}
          onMint={handleMint}
        />
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-8 relative z-10 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 text-white/90">
            Здесь хранятся ваши активы
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Всего предметов: {(inventory?.fragments.total || 0) + (inventory?.cards.total || 0)}
          </p>
          
          {/* Tabs */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              onClick={() => setActiveTab('fragments')}
              variant={activeTab === 'fragments' ? 'default' : 'outline'}
              className={activeTab === 'fragments' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              Осколки ({inventory?.fragments.total || 0})
            </Button>
            <Button
              onClick={() => setActiveTab('cards')}
              variant={activeTab === 'cards' ? 'default' : 'outline'}
              className={activeTab === 'cards' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              Ваши NFT ({inventory?.cards.total || 0})
            </Button>
          </div>

          {/* Craft Button - только на вкладке осколков */}
          {activeTab === 'fragments' && inventory?.fragments.total && inventory.fragments.total >= 3 && (
            <Button
              onClick={() => setShowCraftModal(true)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Создать NFT карту
            </Button>
          )}
        </div>
      </section>

      {/* Rarity Cards Grid or Empty State */}
      {hasAnyItems ? (
        <>
          {/* Fragments Tab */}
          {activeTab === 'fragments' && hasFragments && (
            <section className="py-8 relative z-10 px-6">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Ваши осколки</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {inventory?.fragments.items.map((shard: any) => (
                    <div
                      key={shard.id}
                      className="relative p-4 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition"
                    >
                      <img 
                        src={shard.imageUrl} 
                        alt={shard.name}
                        className="w-full h-32 object-contain mb-2"
                      />
                      <p className="text-sm font-medium text-white text-center">{shard.label}</p>
                      <p className="text-xs text-gray-400 text-center">{shard.name}</p>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        {new Date(shard.collectedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Cards Tab */}
          {activeTab === 'cards' && hasCards && (
            <section className="py-8 relative z-10 px-6">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Ваши NFT карты</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inventory?.cards.items.map((card: any) => {
                    const rarityStyle = rarityConfig[card.rarity] || rarityConfig.common
                    return (
                      <button
                        key={card.id}
                        onClick={() => setSelectedCard(card)}
                        className="relative group rounded-xl overflow-hidden border-2 transition-all duration-500 hover:scale-105 cursor-pointer text-left"
                        style={{
                          borderColor: rarityStyle.color,
                          boxShadow: `0 0 30px rgba(${rarityStyle.glowColor}, 0.3)`,
                        }}
                      >
                        <div className="p-6 bg-gradient-to-b from-gray-900 to-black">
                          {/* Badge редкости */}
                          <div 
                            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                            style={{ 
                              background: rarityStyle.gradient,
                              boxShadow: `0 0 20px rgba(${rarityStyle.glowColor}, 0.5)`
                            }}
                          >
                            {rarityStyle.label}
                          </div>

                          {/* Изображение карты */}
                          <div className="w-full h-64 rounded-lg overflow-hidden mb-4 bg-white/5">
                            {card.imageUrl ? (
                              <img
                                src={card.imageUrl}
                                alt={card.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                NFT Card
                              </div>
                            )}
                          </div>

                          {/* Название */}
                          <h3 className="text-xl font-bold mb-2 text-white">{card.name}</h3>
                          
                          {/* Описание */}
                          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{card.description}</p>
                          
                          {/* Дата создания */}
                          <div className="text-xs text-gray-500">
                            Создана: {new Date(card.craftedAt).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>

                        {/* Glow эффект при наведении */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            boxShadow: `inset 0 0 50px rgba(${rarityStyle.glowColor}, 0.2)`,
                          }}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Empty state для активной вкладки */}
          {activeTab === 'fragments' && !hasFragments && (
            <section className="py-32 relative z-10 px-6">
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-xl text-gray-400 mb-8">У вас пока нет осколков</p>
                <button
                  onClick={() => router.push('/map')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition"
                >
                  Собрать осколки
                </button>
              </div>
            </section>
          )}

          {activeTab === 'cards' && !hasCards && (
            <section className="py-32 relative z-10 px-6">
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-xl text-gray-400 mb-8">У вас пока нет NFT карт</p>
                <p className="text-gray-500 mb-8">Соберите 3 разных осколка (A + B + C) одной карты, чтобы создать NFT</p>
                {hasFragments && (
                  <button
                    onClick={() => setActiveTab('fragments')}
                    className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold text-lg transition"
                  >
                    Посмотреть осколки
                  </button>
                )}
              </div>
            </section>
          )}
        </>
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
    </div>
  )
}
