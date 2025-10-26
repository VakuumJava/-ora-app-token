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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChain, setSelectedChain] = useState("all")
  const [selectedRarity, setSelectedRarity] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const listings: any[] = []

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

        {/* Empty State */}
        <div className="py-24 text-center">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <ShoppingCart className="h-12 w-12 text-white/40" />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-white">Маркетплейс пуст</h3>
          <p className="mb-8 text-gray-400 max-w-md mx-auto">
            Пока никто не выставил NFT на продажу. Будьте первым, кто соберёт карточки и выставит их на маркетплейс!
          </p>
          {isAuthenticated ? (
            <Link href="/map">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"
              >
                Начать собирать карточки
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"
              >
                Зарегистрироваться
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
