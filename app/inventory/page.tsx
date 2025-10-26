"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { CosmicBackground } from "@/components/cosmic-background"
import { ParticlesBackground } from "@/components/particles-background"
import { X } from "lucide-react"
import Image from "next/image"

// Редкости с обнуленными данными
const rarityTiers = [
  {
    name: "Uncommon",
    color: "#3B82F6",
    borderColor: "#3B82F6",
    glowColor: "59, 130, 246",
    chance: "1/3",
    rarity: "Необычный",
    percentage: "0.5%",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
    items: ["Изумрудный осколок", "Лесной амулет", "Зелёное пламя"],
    count: 0,
    image: "/image 18.png",
    description: "Редкие предметы, которые можно найти в различных локациях",
    totalMinted: "0",
    totalSupply: "190,222",
    holders: "0",
    owner: "Qora NFT",
    model: "Stone Pyramid",
    pattern: "Ancient Symbols",
    background: "Deep Space",
    price: "$8.50"
  },
  {
    name: "Rare",
    color: "#10B981",
    borderColor: "#10B981",
    glowColor: "16, 185, 129",
    chance: "1/3",
    rarity: "Редкий",
    percentage: "0.5%",
    gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
    items: ["Сапфировая сфера", "Ледяное сердце", "Морская раковина"],
    count: 0,
    image: "/image 19.png",
    description: "Ценные артефакты с особыми свойствами",
    totalMinted: "0",
    totalSupply: "190,222",
    holders: "0",
    owner: "Qora NFT",
    model: "Crystal Tree",
    pattern: "Nature Flow",
    background: "Forest Green",
    price: "$12.00"
  },
  {
    name: "Legendary",
    color: "#FF8C00",
    borderColor: "#FF8C00",
    glowColor: "255, 140, 0",
    chance: "1/3",
    rarity: "Легендарный",
    percentage: "2%",
    gradient: "linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)",
    items: ["Золотой дракон", "Корона судьбы", "Феникс"],
    count: 0,
    image: "/image 20.png",
    description: "Легендарные сокровища невероятной редкости",
    totalMinted: "0",
    totalSupply: "190,222",
    holders: "0",
    owner: "Qora NFT",
    model: "Golden Gift",
    pattern: "Royal Pattern",
    background: "Cosmic Gold",
    price: "$15.00"
  },
]

export default function InventoryPage() {
  const [selectedRarity, setSelectedRarity] = useState<typeof rarityTiers[0] | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push('/login')
        }
      } catch (error) {
        setIsAuthenticated(false)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  // Показываем загрузку пока проверяем авторизацию
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f] flex items-center justify-center">
        <CosmicBackground />
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    )
  }

  // Если не авторизован, ничего не показываем (идет редирект)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]">
      {/* Фоны */}
      <CosmicBackground />
      <ParticlesBackground />

      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок - без анимации */}
          <div className="text-center mb-8">
            <h1 
              className="text-3xl md:text-4xl font-bold tracking-tight"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "#ffffff",
              }}
            >
              Здесь хранятся ваши активы
            </h1>
          </div>

          {/* Сетка карточек - компактный дизайн */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {rarityTiers.map((rarity) => (
              <div 
                key={rarity.name}
                className="group relative cursor-pointer"
                onClick={() => setSelectedRarity(rarity)}
              >
                {/* Основная карточка - меньше размер */}
                <div 
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg,
                      rgba(${rarity.glowColor}, 0.06) 0%,
                      rgba(${rarity.glowColor}, 0.02) 100%)`,
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    border: `1.5px solid rgba(${rarity.glowColor}, 0.3)`,
                    boxShadow: `0 4px 16px rgba(0, 0, 0, 0.3)`,
                  }}
                >
                  {/* Диагональная плашка сверху справа */}
                  <div 
                    className="absolute top-0 right-0 px-8 py-1.5 text-xs font-bold z-10"
                    style={{
                      background: `rgba(${rarity.glowColor}, 0.9)`,
                      color: "#fff",
                      fontFamily: "'Space Grotesk', sans-serif",
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 20% 100%)",
                      minWidth: "80px",
                      textAlign: "right",
                    }}
                  >
                    {rarity.chance}
                  </div>

                  {/* Изображение подарка - меньше */}
                  <div className="relative flex items-center justify-center pt-10 pb-3 px-4">
                    <div className="relative w-28 h-28">
                      <Image
                        src={rarity.image}
                        alt={rarity.name}
                        fill
                        className="object-contain"
                        style={{
                          filter: `drop-shadow(0 0 15px rgba(${rarity.glowColor}, 0.3))`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Информация о карточке - компактнее */}
                  <div className="relative px-4 pb-3">
                    <div className="text-center mb-2">
                      <h3 
                        className="text-xl font-bold mb-0.5"
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          color: rarity.color,
                        }}
                      >
                        {rarity.name}
                      </h3>
                      <p className="text-[10px] text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {rarity.rarity} редкость
                      </p>
                    </div>

                    {/* Статистика - компактнее */}
                    <div 
                      className="grid grid-cols-2 gap-1.5 mb-2"
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "10px",
                        padding: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <div className="text-center">
                        <div className="text-sm font-bold text-white">
                          {rarity.totalMinted}
                        </div>
                        <div className="text-[9px] text-white/50">Выпущено</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-white">
                          {rarity.holders}
                        </div>
                        <div className="text-[9px] text-white/50">Владельцев</div>
                      </div>
                    </div>

                    {/* Краткое описание */}
                    <p 
                      className="text-[10px] text-white/60 text-center leading-relaxed"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {rarity.count} уникальных предмета
                    </p>
                  </div>

                  {/* Нижняя полоска */}
                  <div 
                    className="h-0.5"
                    style={{
                      background: rarity.gradient,
                      opacity: 0.5,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Модальное окно - более компактное */}
      {selectedRarity && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(12px)",
          }}
          onClick={() => setSelectedRarity(null)}
        >
          <div 
            className="relative w-full max-w-md"
            style={{
              background: "rgba(15, 15, 25, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header с кнопкой закрытия */}
            <div className="relative flex justify-end px-4 pt-4">
              <button
                onClick={() => setSelectedRarity(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Content */}
            <div className="relative px-6 pb-6">
              {/* Image */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <Image
                    src={selectedRarity.image}
                    alt={selectedRarity.name}
                    fill
                    className="object-contain"
                    style={{
                      filter: `drop-shadow(0 0 20px rgba(${selectedRarity.glowColor}, 0.4))`,
                    }}
                  />
                </div>
              </div>

              {/* Title */}
              <h2 
                className="text-2xl font-bold text-center mb-4"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: selectedRarity.color,
                }}
              >
                {selectedRarity.name}
              </h2>

              {/* Detailed Info Table */}
              <div 
                className="rounded-2xl overflow-hidden mb-4"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                {/* Владелец */}
                <div 
                  className="flex justify-between items-center px-4 py-2.5 border-b"
                  style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <span className="text-sm text-white/60">Владелец</span>
                  <span className="text-sm text-white font-medium">{selectedRarity.owner}</span>
                </div>

                {/* Модель */}
                <div 
                  className="flex justify-between items-center px-4 py-2.5 border-b"
                  style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <span className="text-sm text-white/60">Модель</span>
                  <span className="text-sm text-white">{selectedRarity.model}</span>
                </div>

                {/* Узор */}
                <div 
                  className="flex justify-between items-center px-4 py-2.5 border-b"
                  style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <span className="text-sm text-white/60">Узор</span>
                  <span className="text-sm text-white">{selectedRarity.pattern}</span>
                </div>

                {/* Наличие */}
                <div 
                  className="flex justify-between items-center px-4 py-2.5 border-b"
                  style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <span className="text-sm text-white/60">Наличие</span>
                  <span className="text-sm text-white">
                    Выпустили<br />
                    <span className="font-medium">{selectedRarity.totalMinted}/{selectedRarity.totalSupply}</span>
                  </span>
                </div>

                {/* Ценность */}
                <div 
                  className="flex justify-between items-center px-4 py-2.5"
                >
                  <span className="text-sm text-white/60">Ценность</span>
                  <div className="text-right">
                    <div className="text-sm text-white font-bold">{selectedRarity.price}</div>
                    <button 
                      className="text-xs font-medium mt-0.5"
                      style={{ color: selectedRarity.color }}
                    >
                      подробнее
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div 
                  className="rounded-lg p-2.5 text-center"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="text-sm font-bold text-white mb-0.5">
                    {selectedRarity.count}
                  </div>
                  <div className="text-[9px] text-white/50">Предметов</div>
                </div>
                <div 
                  className="rounded-lg p-2.5 text-center"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="text-sm font-bold text-white mb-0.5">
                    {selectedRarity.holders}
                  </div>
                  <div className="text-[9px] text-white/50">Владельцев</div>
                </div>
                <div 
                  className="rounded-lg p-2.5 text-center"
                  style={{
                    background: `rgba(${selectedRarity.glowColor}, 0.15)`,
                    border: `1px solid rgba(${selectedRarity.glowColor}, 0.3)`,
                  }}
                >
                  <div 
                    className="text-sm font-bold mb-0.5"
                    style={{ color: selectedRarity.color }}
                  >
                    {selectedRarity.chance}
                  </div>
                  <div className="text-[9px] text-white/50">Редкость</div>
                </div>
              </div>

              {/* Items List */}
              <div 
                className="rounded-xl p-3"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <h3 
                  className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Предметы в коллекции
                </h3>
                <div className="space-y-1.5">
                  {selectedRarity.items.map((item, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-2 text-sm text-white/80"
                    >
                      <div 
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{ background: selectedRarity.color }}
                      />
                      <span style={{ fontFamily: "'Inter', sans-serif" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
