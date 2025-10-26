"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SiteHeader } from "@/components/site-header"
import { Search, Filter, ShoppingCart } from "lucide-react"
import { authService } from "@/lib/auth"

const chains = [
  "Все цепочки",
  "Museum Chain",
  "Park Chain",
  "Spiritual Chain",
  "Soviet Legacy Chain",
  "Street Art Chain",
  "Modern City Chain",
  "Cultural Chain",
  "Urban Life Chain",
  "Transport Chain",
  "Mountain View Chain",
]

const rarities = ["Все редкости", "Common", "Uncommon", "Rare", "Epic", "Legendary"]

export default function MarketplacePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [listings, setListings] = useState<any[]>([])
  const [filteredListings, setFilteredListings] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChain, setSelectedChain] = useState("all")
  const [selectedRarity, setSelectedRarity] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Загрузка данных
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/login")
          return
        }
        setIsAuthenticated(true)

        // Загружаем маркетплейс
        const marketplaceResponse = await fetch("/api/marketplace")
        if (marketplaceResponse.ok) {
          const data = await marketplaceResponse.json()
          setListings(data.listings)
          setFilteredListings(data.listings)
        } else {
          setError("Ошибка загрузки маркетплейса")
        }
      } catch (error) {
        console.error("Error loading marketplace:", error)
        setError("Ошибка подключения")
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  // Фильтрация
  useEffect(() => {
    let filtered = [...listings]

    // Поиск
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Фильтр по редкости
    if (selectedRarity !== "all") {
      filtered = filtered.filter(item =>
        item.rarity.toLowerCase() === selectedRarity.toLowerCase()
      )
    }

    // Сортировка
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    }

    setFilteredListings(filtered)
  }, [listings, searchQuery, selectedRarity, sortBy])

  // Покупка карты
  const handlePurchase = async (cardId: string) => {
    try {
      const response = await fetch("/api/marketplace/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId }),
      })

      if (response.ok) {
        alert("✅ Карта успешно куплена!")
        // Перезагружаем список
        const marketplaceResponse = await fetch("/api/marketplace")
        if (marketplaceResponse.ok) {
          const data = await marketplaceResponse.json()
          setListings(data.listings)
        }
      } else {
        const error = await response.json()
        alert(`❌ Ошибка: ${error.error}`)
      }
    } catch (error) {
      console.error("Purchase error:", error)
      alert("❌ Ошибка при покупке")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Проверка авторизации...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Glowing background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-32 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[110px]" />
      </div>

      <SiteHeader />

      {/* Hero Section with proper spacing */}
      <section className="pt-28 pb-12 border-b border-white/10 backdrop-blur-sm bg-gradient-to-b from-blue-950/20 to-transparent relative z-10">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mb-4 text-5xl font-bold text-white">Маркетплейс</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-400">
            Покупай и продавай уникальные NFT. Комиссия платформы 5%.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="mx-auto max-w-7xl px-6 py-8 relative z-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск NFT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 focus:border-blue-500"
            />
          </div>

          {/* Sort and Filter */}
          <div className="flex gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] border-white/10 bg-white/5 backdrop-blur-sm text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-black/90 backdrop-blur-xl text-white">
                <SelectItem value="recent">Недавние</SelectItem>
                <SelectItem value="price-low">Цена: низкая</SelectItem>
                <SelectItem value="price-high">Цена: высокая</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
            >
              <Filter className="mr-2 h-4 w-4" />
              Фильтры
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="mb-6 border-white/10 bg-white/5 backdrop-blur-md">
            <CardContent className="p-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Цепочка</label>
                <Select value={selectedChain} onValueChange={setSelectedChain}>
                  <SelectTrigger className="border-white/10 bg-white/5 backdrop-blur-sm text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-black/90 backdrop-blur-xl text-white">
                    {chains.map((chain) => (
                      <SelectItem key={chain} value={chain.toLowerCase().replace(/\s+/g, "-")}>
                        {chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">Редкость</label>
                <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                  <SelectTrigger className="border-white/10 bg-white/5 backdrop-blur-sm text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-black/90 backdrop-blur-xl text-white">
                    {rarities.map((rarity) => (
                      <SelectItem key={rarity} value={rarity.toLowerCase().replace(/\s+/g, "-")}>
                        {rarity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <Card
                key={listing.id}
                className="border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all group"
              >
                <CardContent className="p-4">
                  {/* Image */}
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-white/5">
                    {listing.imageUrl ? (
                      <img
                        src={listing.imageUrl}
                        alt={listing.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                    {/* Rarity Badge */}
                    <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md"
                      style={{
                        background: getRarityGradient(listing.rarity),
                        boxShadow: `0 0 20px ${getRarityColor(listing.rarity)}40`,
                      }}
                    >
                      {listing.rarity.toUpperCase()}
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="text-lg font-bold text-white mb-1 truncate">
                    {listing.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {listing.description || 'Уникальная NFT карта'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                    <span>Продавец</span>
                    <span className="text-blue-400">{listing.seller}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                    <span>Доступно</span>
                    <span className="text-white">{listing.available}</span>
                  </div>

                  {/* Price and Buy */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <div className="text-xs text-gray-400">Цена</div>
                      <div className="text-xl font-bold text-white">${listing.price}</div>
                    </div>
                    <Button
                      onClick={() => handlePurchase(listing.id)}
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"
                      disabled={listing.available === 0}
                    >
                      {listing.available === 0 ? 'Распродано' : 'Купить'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <ShoppingCart className="h-12 w-12 text-white/40" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-white">
              {error ? 'Ошибка загрузки' : 'Ничего не найдено'}
            </h3>
            <p className="mb-8 text-gray-400 max-w-md mx-auto">
              {error || 'Попробуйте изменить фильтры поиска'}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

// Helper functions for rarity colors
function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: '#9CA3AF',
    uncommon: '#3B82F6',
    rare: '#10B981',
    epic: '#8B5CF6',
    legendary: '#FF8C00',
  }
  return colors[rarity.toLowerCase()] || '#9CA3AF'
}

function getRarityGradient(rarity: string): string {
  const gradients: Record<string, string> = {
    common: 'linear-gradient(135deg, #9CA3AF 0%, #D1D5DB 100%)',
    uncommon: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
    rare: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    epic: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    legendary: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)',
  }
  return gradients[rarity.toLowerCase()] || gradients.common
}
