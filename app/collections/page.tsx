"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { MapPin, Lock, CheckCircle2, Sparkles, ChevronRight, X } from "lucide-react"

const collections = [
  {
    id: "kalpak-chain",
    title: "Kalpak",
    subtitle: "Традиционный головной убор",
    description: "Символ кыргызской культуры",
    rarity: "Common",
    gradient: "from-red-500 to-red-600",
    bgGradient: "from-red-500/20 to-red-600/20",
    totalNFTs: 4,
    collectedNFTs: 1,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-6BBNH7MCHWG7fkmS89ZWol7pU4rqN9.png",
    nfts: [
      {
        id: 1,
        name: "Калпак с орнаментом",
        rarity: "Common",
        collected: true,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-6BBNH7MCHWG7fkmS89ZWol7pU4rqN9.png",
      },
      {
        id: 2,
        name: "Белый калпак",
        rarity: "Common",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: 3,
        name: "Праздничный калпак",
        rarity: "Common",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: 4,
        name: "Калпак мастера",
        rarity: "Common",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
    ],
  },
  {
    id: "museums-chain",
    title: "Museums",
    subtitle: "Музейные артефакты",
    description: "Сокровища истории Бишкека",
    rarity: "Uncommon",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/20 to-emerald-500/20",
    totalNFTs: 4,
    collectedNFTs: 2,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Oz6fiIKAnwJFWqgyIrXNULTMDsBGEs.png",
    nfts: [
      {
        id: 5,
        name: "Древо жизни",
        rarity: "Uncommon",
        collected: true,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Oz6fiIKAnwJFWqgyIrXNULTMDsBGEs.png",
      },
      {
        id: 6,
        name: "Музейный экспонат",
        rarity: "Uncommon",
        collected: true,
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: 7,
        name: "Артефакт времени",
        rarity: "Uncommon",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: 8,
        name: "Реликвия прошлого",
        rarity: "Uncommon",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
    ],
  },
  {
    id: "ancienty-chain",
    title: "Ancienty",
    subtitle: "Древние символы",
    description: "Мистические артефакты древности",
    rarity: "Rare",
    gradient: "from-gray-600 to-gray-700",
    bgGradient: "from-gray-600/20 to-gray-700/20",
    totalNFTs: 4,
    collectedNFTs: 0,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QkThv5DjEURVkdYSHiICeaM8qlBFcM.png",
    nfts: [
      {
        id: 9,
        name: "Око древности",
        rarity: "Rare",
        collected: false,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QkThv5DjEURVkdYSHiICeaM8qlBFcM.png",
      },
      {
        id: 10,
        name: "Древний амулет",
        rarity: "Rare",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: 11,
        name: "Символ предков",
        rarity: "Rare",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: 12,
        name: "Реликвия веков",
        rarity: "Rare",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
    ],
  },
  {
    id: "ring-chain",
    title: "Ring",
    subtitle: "Звон колоколов",
    description: "Духовные символы города",
    rarity: "Epic",
    gradient: "from-yellow-500 to-amber-500",
    bgGradient: "from-yellow-500/20 to-amber-500/20",
    totalNFTs: 4,
    collectedNFTs: 1,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HiwQuX32ysPx493StvCayAxmxKtdx6.png",
    nfts: [
      {
        id: 13,
        name: "Колокол времени",
        rarity: "Epic",
        collected: true,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HiwQuX32ysPx493StvCayAxmxKtdx6.png",
      },
      {
        id: 14,
        name: "Звон надежды",
        rarity: "Epic",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: 15,
        name: "Священный колокол",
        rarity: "Epic",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: 16,
        name: "Эхо веры",
        rarity: "Epic",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
    ],
  },
  {
    id: "bishkek-chain",
    title: "Bishkek",
    subtitle: "Дух столицы",
    description: "Современная культура Бишкека",
    rarity: "Legendary",
    gradient: "from-blue-600 to-purple-600",
    bgGradient: "from-blue-600/20 to-purple-600/20",
    totalNFTs: 4,
    collectedNFTs: 0,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yqLxxKYFATDLOlRaKWVTTQZOm0SuI4.png",
    nfts: [
      {
        id: 17,
        name: "Bishkek граффити",
        rarity: "Legendary",
        collected: false,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yqLxxKYFATDLOlRaKWVTTQZOm0SuI4.png",
      },
      {
        id: 18,
        name: "Городской дух",
        rarity: "Legendary",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: 19,
        name: "Сердце столицы",
        rarity: "Legendary",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: 20,
        name: "Душа Бишкека",
        rarity: "Legendary",
        collected: false,
        image: "/placeholder.svg?height=300&width=300",
      },
    ],
  },
]

const rarityColors = {
  Common: "bg-gray-500",
  Uncommon: "bg-green-500",
  Rare: "bg-blue-500",
  Epic: "bg-purple-500",
  Legendary: "bg-amber-500",
}

export default function CollectionsPage() {
  const [selectedChain, setSelectedChain] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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

  const selectedCollection = collections.find((c) => c.id === selectedChain)

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
        <div className="absolute top-32 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-60 left-10 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-32 left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-[110px]" />
      </div>

      <SiteHeader />

      <section className="pt-28 pb-12 border-b border-white/10 backdrop-blur-sm bg-gradient-to-b from-blue-950/20 to-transparent relative z-10">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Назад к коллекциям
          </Link>
          <Badge className="mb-6 border-blue-500/30 bg-blue-500/10 text-blue-400">
            <Sparkles className="mr-2 h-4 w-4" />5 уникальных коллекций
          </Badge>
          <h1 className="mb-4 text-5xl font-bold text-white">Коллекции Бишкека</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-400">
            Исследуй город и собирай уникальные NFT-артефакты. Каждая коллекция рассказывает свою историю о Бишкеке.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 relative z-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {collections.map((collection) => {
            const progress = (collection.collectedNFTs / collection.totalNFTs) * 100

            return (
              <Card
                key={collection.id}
                className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-md transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
                onClick={() => setSelectedChain(collection.id)}
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${collection.bgGradient} opacity-0 transition-opacity group-hover:opacity-100`}
                />

                <CardContent className="relative p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-2xl font-bold text-white">{collection.title}</h3>
                      <p className="mb-2 text-sm text-blue-400">{collection.subtitle}</p>
                      <p className="text-sm text-gray-400">{collection.description}</p>
                    </div>
                    <Badge className={`bg-gradient-to-r ${collection.gradient} border-0 text-white`}>
                      {collection.rarity}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-400">Прогресс</span>
                      <span className="font-medium text-white">
                        {collection.collectedNFTs}/{collection.totalNFTs}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
                      <div
                        className={`h-full bg-gradient-to-r ${collection.gradient} transition-all`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* NFT Preview */}
                  <div className="flex items-center gap-2">
                    {collection.nfts.slice(0, 4).map((nft, i) => (
                      <div
                        key={i}
                        className={`relative h-12 w-12 overflow-hidden rounded-lg border backdrop-blur-sm ${
                          nft.collected ? "border-blue-500 bg-blue-500/10" : "border-white/20 bg-white/5"
                        }`}
                      >
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.name}
                          className="h-full w-full object-cover"
                        />
                        {nft.collected ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-blue-500/80 backdrop-blur-sm">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {selectedCollection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          onClick={() => setSelectedChain(null)}
        >
          <Card
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border-white/20 bg-black/90 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="mb-2 text-4xl font-bold text-white">{selectedCollection.title}</h2>
                    <p className="mb-2 text-lg text-blue-400">{selectedCollection.subtitle}</p>
                    <p className="text-gray-400">{selectedCollection.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedChain(null)}
                    className="text-gray-400 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-400">Собрано</span>
                    <span className="font-medium text-white">
                      {selectedCollection.collectedNFTs}/{selectedCollection.totalNFTs} NFT
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
                    <div
                      className={`h-full bg-gradient-to-r ${selectedCollection.gradient}`}
                      style={{ width: `${(selectedCollection.collectedNFTs / selectedCollection.totalNFTs) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* NFTs Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {selectedCollection.nfts.map((nft) => (
                  <Card
                    key={nft.id}
                    className={`group relative overflow-hidden border backdrop-blur-md ${
                      nft.collected ? "border-blue-500 bg-blue-500/10" : "border-white/10 bg-white/5"
                    } transition-all hover:border-white/20`}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                      {!nft.collected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                          <Lock className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      {nft.collected && (
                        <div className="absolute right-2 top-2 rounded-full bg-blue-500 p-1">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium text-white">{nft.name}</h4>
                        <Badge
                          className={`${rarityColors[nft.rarity as keyof typeof rarityColors]} border-0 text-white`}
                        >
                          {nft.rarity}
                        </Badge>
                      </div>

                      {nft.collected ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-blue-500 text-blue-400 bg-transparent hover:bg-blue-500/10"
                        >
                          В коллекции
                        </Button>
                      ) : (
                        <Link href="/map">
                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            Найти на карте
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Complete Chain Reward */}
              {selectedCollection.collectedNFTs === selectedCollection.totalNFTs && (
                <Card className="mt-8 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="mb-1 font-bold text-white">Цепочка завершена!</h4>
                        <p className="text-sm text-gray-400">Вы собрали все NFT из этой коллекции</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
