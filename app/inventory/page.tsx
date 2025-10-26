"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { CosmicBackground } from "@/components/cosmic-background"
import { ParticlesBackground } from "@/components/particles-background"
import { FadeIn } from "@/components/fade-in"
import { X, Sparkles, Star, TrendingUp, Award } from "lucide-react"
import Image from "next/image"

// Редкости с процентовками
const rarityTiers = [
  {
    name: "Uncommon",
    color: "#3B82F6",
    borderColor: "#3B82F6",
    glowColor: "59, 130, 246",
    chance: "1/1,000",
    rarity: "Необычный",
    percentage: "0.5%",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
    items: ["Изумрудный осколок", "Лесной амулет", "Зелёное пламя"],
    count: 3,
    image: "/image 18.png",
    description: "Редкие предметы, которые можно найти в различных локациях",
    totalMinted: "25,430",
    totalSupply: "190,222",
    holders: "18,234",
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
    chance: "1/10,000",
    rarity: "Редкий",
    percentage: "0.5%",
    gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
    items: ["Сапфировая сфера", "Ледяное сердце", "Морская раковина"],
    count: 3,
    image: "/image 19.png",
    description: "Ценные артефакты с особыми свойствами",
    totalMinted: "8,921",
    totalSupply: "190,222",
    holders: "7,102",
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
    chance: "1/1,000,000",
    rarity: "Легендарный",
    percentage: "2%",
    gradient: "linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)",
    items: ["Золотой дракон", "Корона судьбы", "Феникс"],
    count: 3,
    image: "/image 20.png",
    description: "Легендарные сокровища невероятной редкости",
    totalMinted: "156",
    totalSupply: "190,222",
    holders: "148",
    owner: "Qora NFT",
    model: "Golden Gift",
    pattern: "Royal Pattern",
    background: "Cosmic Gold",
    price: "$15.00"
  },
]

export default function InventoryPage() {
  const [selectedRarity, setSelectedRarity] = useState<typeof rarityTiers[0] | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]">
      {/* Фоны */}
      <CosmicBackground />
      <ParticlesBackground />

      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Заголовок */}
          <FadeIn delay={0.1} duration={0.8}>
            <div className="text-center mb-12">
              <h1 
                className="text-4xl font-bold tracking-tight"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "#ffffff",
                }}
              >
                Здесь хранятся ваши активы
              </h1>
            </div>
          </FadeIn>

          {/* Сетка карточек - минималистичный дизайн */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {rarityTiers.map((rarity, index) => (
              <FadeIn key={rarity.name} delay={0.2 + index * 0.1} duration={0.8}>
                <div 
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedRarity(rarity)}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Основная карточка */}
                  <div 
                    className="relative rounded-3xl overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, 
                        rgba(${rarity.glowColor}, 0.06) 0%, 
                        rgba(${rarity.glowColor}, 0.02) 100%)`,
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      border: `1.5px solid rgba(${rarity.glowColor}, 0.3)`,
                      boxShadow: `0 4px 16px rgba(0, 0, 0, 0.3), 
                                 0 0 0 1px rgba(255, 255, 255, 0.05) inset`,
                    }}
                  >
                    {/* Фоновые элементы как на главной */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div 
                        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20"
                        style={{ background: rarity.color }}
                      />
                      <div 
                        className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-15"
                        style={{ background: rarity.color }}
                      />
                    </div>

                    {/* Бейдж с шансом */}
                    <div 
                      className="absolute top-0 right-0 px-5 py-2 text-xs font-bold z-10"
                      style={{
                        background: `rgba(${rarity.glowColor}, 0.8)`,
                        backdropFilter: "blur(10px)",
                        color: "#fff",
                        fontFamily: "'Space Grotesk', sans-serif",
                        clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)",
                        minWidth: "70px",
                        textAlign: "right",
                      }}
                    >
                      {rarity.chance}
                    </div>

                    {/* Изображение подарка */}
                    <div className="relative flex items-center justify-center pt-12 pb-4 px-6">
                      <div className="relative w-40 h-40">
                        <Image
                          src={rarity.image}
                          alt={rarity.name}
                          fill
                          className="object-contain"
                          style={{
                            filter: `drop-shadow(0 0 20px rgba(${rarity.glowColor}, 0.3))`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Информация о карточке */}
                    <div className="relative px-5 pb-4">
                      <div className="text-center mb-3">
                        <h3 
                          className="text-2xl font-bold mb-1"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: rarity.color,
                          }}
                        >
                          {rarity.name}
                        </h3>
                        <p className="text-xs text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {rarity.rarity} редкость
                        </p>
                      </div>

                      {/* Статистика */}
                      <div 
                        className="grid grid-cols-2 gap-2 mb-3"
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          backdropFilter: "blur(10px)",
                          borderRadius: "12px",
                          padding: "10px",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        <div className="text-center">
                          <div className="text-base font-bold text-white mb-0.5">
                            {rarity.totalMinted}
                          </div>
                          <div className="text-[10px] text-white/50">Выпущено</div>
                        </div>
                        <div className="text-center">
                          <div className="text-base font-bold text-white mb-0.5">
                            {rarity.holders}
                          </div>
                          <div className="text-[10px] text-white/50">Владельцев</div>
                        </div>
                      </div>

                      {/* Краткое описание */}
                      <p 
                        className="text-xs text-white/60 text-center leading-relaxed"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {rarity.count} уникальных предмета в коллекции
                      </p>
                    </div>

                    {/* Нижняя полоска */}
                    <div 
                      className="h-1"
                      style={{
                        background: rarity.gradient,
                        opacity: 0.5,
                      }}
                    />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </main>

      {/* Модальное окно - стиль Telegram подарков */}
      {selectedRarity && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(12px)",
          }}
          onClick={() => setSelectedRarity(null)}
        >
          <div 
            className="relative w-full max-w-md animate-in zoom-in-95 duration-200"
            style={{
              background: "rgba(15, 15, 25, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Фоновые элементы */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[20px]">
              <div 
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10"
                style={{ background: selectedRarity.color }}
              />
            </div>

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
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <Image
                    src={selectedRarity.image}
                    alt={selectedRarity.name}
                    fill
                    className="object-contain"
                    style={{
                      filter: `drop-shadow(0 0 24px rgba(${selectedRarity.glowColor}, 0.4))`,
                    }}
                  />
                </div>
              </div>

              {/* Title */}
              <h2 
                className="text-2xl font-bold text-center mb-6"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: selectedRarity.color,
                }}
              >
                {selectedRarity.name}
              </h2>

              {/* Detailed Info Table - как в Telegram */}
              <div 
                className="rounded-2xl overflow-hidden mb-4"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                {/* Владелец */}
                <div 
                  className="flex justify-between items-center px-4 py-3 border-b"
                  style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <span className="text-sm text-white/60">Владелец</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">{selectedRarity.owner}</span>
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: selectedRarity.gradient }}
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Модель */}
                <div 
                  className="flex justify-between items-center px-4 py-3 border-b"
                  style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <span className="text-sm text-white/60">Модель</span>
                  <span className="text-sm text-white">{selectedRarity.model}</span>
                </div>

                {/* Узор */}
                <div 
                  className="flex justify-between items-center px-4 py-3 border-b"
                  style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <span className="text-sm text-white/60">Узор</span>
                  <span className="text-sm text-white">{selectedRarity.pattern}</span>
                </div>

                {/* Фон */}
                <div 
                  className="flex justify-between items-center px-4 py-3 border-b"
                  style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <span className="text-sm text-white/60">Фон</span>
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `rgba(${selectedRarity.glowColor}, 0.2)`,
                      color: selectedRarity.color,
                    }}
                  >
                    {selectedRarity.percentage}
                  </div>
                </div>

                {/* Наличие */}
                <div 
                  className="flex justify-between items-center px-4 py-3 border-b"
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
                  className="flex justify-between items-center px-4 py-3"
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
                  className="rounded-lg p-3 text-center"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="text-base font-bold text-white mb-1">
                    {selectedRarity.count}
                  </div>
                  <div className="text-[10px] text-white/50">Предметов</div>
                </div>
                <div 
                  className="rounded-lg p-3 text-center"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="text-base font-bold text-white mb-1">
                    {selectedRarity.holders}
                  </div>
                  <div className="text-[10px] text-white/50">Владельцев</div>
                </div>
                <div 
                  className="rounded-lg p-3 text-center"
                  style={{
                    background: `rgba(${selectedRarity.glowColor}, 0.15)`,
                    border: `1px solid rgba(${selectedRarity.glowColor}, 0.3)`,
                  }}
                >
                  <div 
                    className="text-base font-bold mb-1"
                    style={{ color: selectedRarity.color }}
                  >
                    {selectedRarity.chance}
                  </div>
                  <div className="text-[10px] text-white/50">Редкость</div>
                </div>
              </div>

              {/* Items List */}
              <div 
                className="rounded-xl p-4"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <h3 
                  className="text-xs font-semibold text-white/70 mb-3 uppercase tracking-wide"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Предметы в коллекции
                </h3>
                <div className="space-y-2">
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

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
