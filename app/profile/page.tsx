"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { MapPin, Trophy, Flame, TrendingUp, Grid3x3, List, Share2, Settings } from "lucide-react"

const rarityColors = {
  Common: "bg-gray-500",
  Uncommon: "bg-green-500",
  Rare: "bg-blue-500",
  Epic: "bg-purple-500",
  Legendary: "bg-amber-500",
}

export default function ProfilePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState<"inventory" | "achievements">("inventory")
  const isLoggedIn = false // TODO: Replace with real auth check

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Glowing background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-32 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-indigo-500/20 rounded-full blur-[110px]" />
      </div>

      {/* Global Header */}
      <SiteHeader />

      {/* Main Content with padding for fixed header */}
      <div className="pt-20 relative z-10">
      {/* Main Content */}
      {isLoggedIn ? (
        <div className="min-h-screen bg-[#0a0a0a]">
          {/* Profile Header */}
          <section className="border-b border-white/10 bg-gradient-to-b from-blue-950/20 to-transparent">
            <div className="mx-auto max-w-7xl px-6 py-12">
              <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-32 w-32 overflow-hidden rounded-2xl border-4 border-blue-500">
                    <img
                      src="/placeholder.svg" // Placeholder for user avatar
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#0a0a0a] bg-gradient-to-br from-purple-500 to-pink-500">
                    <span className="text-sm font-bold text-white">3</span> {/* Placeholder for user level */}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h1 className="text-4xl font-bold text-white">CryptoHunter</h1> {/* Placeholder for username */}
                    <span className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-3 py-1 text-sm font-medium text-white">
                      Исследователь {/* Placeholder for rank */}
                    </span>
                  </div>
                  <p className="mb-4 text-gray-400">Участник с Январь 2025 {/* Placeholder for joined date */}</p>

                  <div className="flex flex-wrap gap-3">
                    <Link href="/login">
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                        <Share2 className="mr-2 h-4 w-4" />
                        Поделиться профилем
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Настройки
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Всего NFT", value: "5", icon: Grid3x3, color: "from-blue-500 to-cyan-400" },
                  { label: "Цепочки", value: "0/10", icon: Trophy, color: "from-amber-500 to-orange-500" },
                  { label: "Стоимость", value: "2,450 SHD", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
                  { label: "Уровень", value: "3", icon: Flame, color: "from-purple-500 to-pink-500" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-gray-400">{stat.label}</span>
                      <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-2`}>
                        <stat.icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tabs */}
          <section className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "inventory" ? "default" : "ghost"}
                  onClick={() => setActiveTab("inventory")}
                  className={
                    activeTab === "inventory"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                      : "text-gray-400 hover:text-white"
                  }
                >
                  Инвентарь (5) {/* Placeholder for number of NFTs */}
                </Button>
                <Button
                  variant={activeTab === "achievements" ? "default" : "ghost"}
                  onClick={() => setActiveTab("achievements")}
                  className={
                    activeTab === "achievements"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                      : "text-gray-400 hover:text-white"
                  }
                >
                  Достижения (2/5) {/* Placeholder for number of unlocked achievements */}
                </Button>
              </div>

              {activeTab === "inventory" && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "text-white" : "text-gray-400"}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "text-white" : "text-gray-400"}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Inventory Tab */}
            {activeTab === "inventory" && (
              <>
                {viewMode === "grid" ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 5, 6, 13, 28].map((nftId) => (
                      <div
                        key={nftId}
                        className="group overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10"
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src="/placeholder.svg" // Placeholder for NFT image
                            alt="NFT Name"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        <div className="p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="mb-1 font-medium text-white">NFT Name</h3> {/* Placeholder for NFT name */}
                              <p className="text-xs text-gray-400">Chain Name</p> {/* Placeholder for chain name */}
                            </div>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium text-white ${rarityColors["Common"]}`}
                            >
                              Common {/* Placeholder for rarity */}
                            </span>
                          </div>

                          <div className="mb-3 flex items-center justify-between text-sm">
                            <span className="text-gray-400">Стоимость</span>
                            <span className="font-medium text-green-400">120 SHD</span>{" "}
                            {/* Placeholder for NFT value */}
                          </div>

                          <Link href={`/marketplace?nft=${nftId}`}>
                            <Button size="sm" className="w-full bg-white/10 text-white hover:bg-white/20">
                              Продать
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[1, 5, 6, 13, 28].map((nftId) => (
                      <div
                        key={nftId}
                        className="flex items-center gap-4 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 backdrop-blur-sm transition-all hover:border-white/20"
                      >
                        <div className="h-16 w-16 overflow-hidden rounded-lg">
                          <img
                            src="/placeholder.svg" // Placeholder for NFT image
                            alt="NFT Name"
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="mb-1 font-medium text-white">NFT Name</h3> {/* Placeholder for NFT name */}
                          <p className="text-sm text-gray-400">Chain Name</p> {/* Placeholder for chain name */}
                        </div>

                        <div className="text-right">
                          <div className="mb-1 font-medium text-green-400">120 SHD</div>{" "}
                          {/* Placeholder for NFT value */}
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium text-white ${rarityColors["Common"]}`}
                          >
                            Common {/* Placeholder for rarity */}
                          </span>
                        </div>

                        <Link href={`/marketplace?nft=${nftId}`}>
                          <Button size="sm" variant="outline" className="border-white/20 text-white bg-transparent">
                            Продать
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { id: 1, name: "Первый шаг", description: "Собрал первый NFT", unlocked: true, icon: "🎯" },
                  { id: 2, name: "Коллекционер", description: "Собрал 5 NFT", unlocked: true, icon: "📦" },
                  { id: 3, name: "Исследователь", description: "Посетил 10 локаций", unlocked: false, icon: "🗺️" },
                  { id: 4, name: "Мастер цепочек", description: "Завершил первую цепочку", unlocked: false, icon: "⛓️" },
                  { id: 5, name: "Легенда города", description: "Собрал все 10 цепочек", unlocked: false, icon: "👑" },
                ].map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`rounded-xl border p-6 transition-all ${
                      achievement.unlocked
                        ? "border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
                        : "border-white/10 bg-white/5 opacity-50"
                    }`}
                  >
                    <div className="mb-4 text-4xl">{achievement.icon}</div>
                    <h3 className="mb-2 text-lg font-bold text-white">{achievement.name}</h3>{" "}
                    {/* Placeholder for achievement name */}
                    <p className="mb-4 text-sm text-gray-400">{achievement.description}</p>{" "}
                    {/* Placeholder for achievement description */}
                    {achievement.unlocked ? (
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <Trophy className="h-4 w-4" />
                        <span>Разблокировано</span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Заблокировано</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="flex min-h-[80vh] items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-white/5 p-6">
                <LogIn className="h-16 w-16 text-white/40" />
              </div>
            </div>
            <h2 className="mb-3 text-2xl font-bold text-white">Войдите, чтобы увидеть профиль</h2>
            <p className="mb-8 text-gray-400">
              Авторизуйтесь, чтобы отслеживать свою статистику, достижения и коллекцию
            </p>
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
      )}
      </div>
    </div>
  )
}
