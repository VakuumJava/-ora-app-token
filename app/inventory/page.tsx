"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Package, CheckCircle2, Lock, ArrowRight, MapPin } from "lucide-react"

// Mock user inventory data
const fragmentColors = {
  A: "from-red-500 to-red-600",
  B: "from-green-500 to-green-600",
  C: "from-blue-500 to-blue-600",
}

const rarityColors = {
  Common: "bg-gray-500",
  Uncommon: "bg-green-500",
  Rare: "bg-blue-500",
  Epic: "bg-purple-500",
  Legendary: "bg-amber-500",
}

export default function InventoryPage() {
  const [assemblingCard, setAssemblingCard] = useState<string | null>(null)
  const isLoggedIn = false // TODO: Replace with real auth check
  const userFragments: any[] = []
  const userCards: any[] = []

  // Group fragments by card
  const fragmentsByCard = userFragments.reduce(
    (acc, frag) => {
      if (!acc[frag.cardId]) {
        acc[frag.cardId] = {
          cardId: frag.cardId,
          cardName: frag.cardName,
          chain: frag.chain,
          rarity: frag.rarity,
          fragments: [],
        }
      }
      acc[frag.cardId].fragments.push(frag)
      return acc
    },
    {} as Record<string, any>,
  )

  const cardProgress = Object.values(fragmentsByCard).map((card: any) => {
    const collected = card.fragments.filter((f: any) => f.collected).length
    const total = card.fragments.length
    const canAssemble = collected === total
    return { ...card, collected, total, canAssemble }
  })

  const handleAssemble = (cardId: string) => {
    setAssemblingCard(cardId)
    // TODO: Call API to assemble card
    setTimeout(() => {
      alert("Карточка собрана! (В продакшене здесь будет реальная сборка)")
      setAssemblingCard(null)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Glowing background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-[110px]" />
      </div>

      {/* Header */}
      <SiteHeader />

      {/* Main Content with proper spacing */}
      <div className="mx-auto max-w-7xl px-6 py-12 pt-28 relative z-10">
        {!isLoggedIn ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="max-w-md text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-white/5 p-6">
                  <Package className="h-16 w-16 text-white/40" />
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-white">Войдите, чтобы увидеть инвентарь</h2>
              <p className="mb-8 text-gray-400">Авторизуйтесь, чтобы начать собирать фрагменты и карточки</p>
              <div className="flex justify-center gap-3">
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">Войти</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                    Регистрация
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="mb-2 text-4xl font-bold text-white">Инвентарь</h1>
              <p className="text-gray-400">Ваши фрагменты и собранные карточки</p>
            </div>

            <Tabs defaultValue="fragments" className="w-full">
              <TabsList className="mb-8 bg-white/5 border border-white/10">
                <TabsTrigger value="fragments" className="data-[state=active]:bg-blue-500">
                  <Package className="mr-2 h-4 w-4" />
                  Фрагменты ({cardProgress.length})
                </TabsTrigger>
                <TabsTrigger value="cards" className="data-[state=active]:bg-blue-500">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Карточки ({userCards.length})
                </TabsTrigger>
              </TabsList>

              {/* Fragments Tab */}
              <TabsContent value="fragments" className="space-y-6">
                {cardProgress.length > 0 ? (
                  cardProgress.map((card) => (
                    <div
                      key={card.cardId}
                      className={`rounded-2xl border p-6 transition-all ${
                        card.canAssemble
                          ? "border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/20"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <div className="mb-1 text-xs text-gray-400">{card.chain}</div>
                          <h3 className="text-xl font-bold text-white">{card.cardName}</h3>
                          <div className="mt-2 inline-flex items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium text-white ${rarityColors[card.rarity as keyof typeof rarityColors]}`}
                            >
                              {card.rarity}
                            </span>
                            <span
                              className={`text-sm font-medium ${card.canAssemble ? "text-green-400" : "text-gray-400"}`}
                            >
                              {card.collected}/{card.total} фрагментов
                            </span>
                          </div>
                        </div>

                        {card.canAssemble && (
                          <Button
                            onClick={() => handleAssemble(card.cardId)}
                            disabled={assemblingCard === card.cardId}
                            className="bg-gradient-to-r from-green-500 to-emerald-400 text-white hover:from-green-600 hover:to-emerald-500"
                          >
                            {assemblingCard === card.cardId ? (
                              <>
                                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                Сборка...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Собрать карточку
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Fragment Progress */}
                      <div className="grid grid-cols-3 gap-3">
                        {card.fragments.map((frag: any) => (
                          <div
                            key={`${card.cardId}-${frag.fragment}`}
                            className={`relative aspect-[3/4] overflow-hidden rounded-xl border-2 transition-all ${
                              frag.collected ? "border-white/20 shadow-lg" : "border-white/10 opacity-40"
                            }`}
                          >
                            {frag.collected ? (
                              <div
                                className={`h-full w-full bg-gradient-to-br ${fragmentColors[frag.fragment as keyof typeof fragmentColors]} flex items-center justify-center`}
                              >
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-white mb-2">{frag.fragment}</div>
                                  <div className="text-xs text-white/80">Фрагмент</div>
                                </div>
                                <div className="absolute top-2 right-2">
                                  <CheckCircle2 className="h-5 w-5 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                                <div className="text-center">
                                  <Lock className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                                  <div className="text-2xl font-bold text-gray-600">{frag.fragment}</div>
                                  <div className="text-xs text-gray-600">Не собран</div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {!card.canAssemble && (
                        <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                          <div className="flex items-center gap-2 text-sm text-blue-300">
                            <ArrowRight className="h-4 w-4" />
                            <span>Найдите оставшиеся фрагменты на карте</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                    <Package className="mx-auto mb-4 h-16 w-16 text-gray-600" />
                    <h3 className="mb-2 text-xl font-bold text-white">Нет фрагментов</h3>
                    <p className="mb-6 text-gray-400">Начните собирать фрагменты на карте</p>
                    <Link href="/map">
                      <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                        <MapPin className="mr-2 h-4 w-4" />
                        Открыть карту
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              {/* Cards Tab */}
              <TabsContent value="cards">
                {userCards.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {userCards.map((card) => (
                      <div
                        key={card.id}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-white/20 hover:shadow-xl"
                      >
                        <div className="aspect-[2/3] overflow-hidden">
                          <img
                            src={card.image || "/placeholder.svg"}
                            alt={card.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <div className="mb-1 text-xs text-gray-400">{card.chain}</div>
                          <h3 className="mb-2 font-bold text-white">{card.name}</h3>
                          <div className="flex items-center justify-between">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium text-white ${rarityColors[card.rarity as keyof typeof rarityColors]}`}
                            >
                              {card.rarity}
                            </span>
                            <Link href={`/marketplace?sell=${card.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                              >
                                Продать
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                    <Sparkles className="mx-auto mb-4 h-16 w-16 text-gray-600" />
                    <h3 className="mb-2 text-xl font-bold text-white">Нет карточек</h3>
                    <p className="mb-6 text-gray-400">Соберите все 3 фрагмента (A+B+C), чтобы получить карточку</p>
                    <Link href="/map">
                      <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                        <MapPin className="mr-2 h-4 w-4" />
                        Собирать фрагменты
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
