"use client"

import { useState } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Package, MapPin, Users, ShieldAlert, Plus, Edit, Trash2, Eye, EyeOff, Save } from "lucide-react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("collections")

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Glowing background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-red-500/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-32 left-1/3 w-96 h-96 bg-blue-500/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[110px]" />
      </div>

      {/* Global Header */}
      <SiteHeader />
      
      {/* Admin Badge */}
      <div className="pt-20 pb-4 border-b border-white/10 bg-black/80 relative z-10">
        <div className="mx-auto max-w-7xl px-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white">
            <ShieldAlert className="h-4 w-4" />
            ADMIN PANEL
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">Админ-панель</h1>
          <p className="text-gray-400">Управление коллекциями, фрагментами и пользователями</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 bg-white/5 border border-white/10">
            <TabsTrigger value="collections" className="data-[state=active]:bg-blue-500">
              <Package className="mr-2 h-4 w-4" />
              Коллекции
            </TabsTrigger>
            <TabsTrigger value="fragments" className="data-[state=active]:bg-blue-500">
              <MapPin className="mr-2 h-4 w-4" />
              Фрагменты
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-500">
              <Users className="mr-2 h-4 w-4" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="moderation" className="data-[state=active]:bg-blue-500">
              <ShieldAlert className="mr-2 h-4 w-4" />
              Модерация
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-500">
              <Settings className="mr-2 h-4 w-4" />
              Настройки
            </TabsTrigger>
          </TabsList>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Управление коллекциями</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Создать коллекцию
              </Button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Название</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Цепочка</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Карточек</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Лимит</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Статус</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    {
                      name: "Urban Relics",
                      chain: "Museum Chain",
                      cards: 4,
                      limit: 1000,
                      active: true,
                    },
                    {
                      name: "Urban Relics",
                      chain: "Park Chain",
                      cards: 4,
                      limit: 1500,
                      active: true,
                    },
                    {
                      name: "Urban Relics",
                      chain: "Spiritual Chain",
                      cards: 4,
                      limit: 800,
                      active: true,
                    },
                  ].map((collection, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{collection.name}</td>
                      <td className="px-6 py-4 text-gray-400">{collection.chain}</td>
                      <td className="px-6 py-4 text-gray-400">{collection.cards}</td>
                      <td className="px-6 py-4 text-gray-400">{collection.limit}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                            collection.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {collection.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          {collection.active ? "Активна" : "Скрыта"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Fragments Tab */}
          <TabsContent value="fragments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Управление фрагментами</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Добавить фрагмент
              </Button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-lg font-bold text-white">Создать новый фрагмент</h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cardId" className="text-gray-300">
                    ID карточки
                  </Label>
                  <Input id="cardId" placeholder="museum-1" className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fragmentType" className="text-gray-300">
                    Тип фрагмента
                  </Label>
                  <select
                    id="fragmentType"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                  >
                    <option value="A">Фрагмент A</option>
                    <option value="B">Фрагмент B</option>
                    <option value="C">Фрагмент C</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lat" className="text-gray-300">
                    Широта (Latitude)
                  </Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.0001"
                    placeholder="42.8746"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lng" className="text-gray-300">
                    Долгота (Longitude)
                  </Label>
                  <Input
                    id="lng"
                    type="number"
                    step="0.0001"
                    placeholder="74.6122"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="radius" className="text-gray-300">
                    Радиус чекина (м)
                  </Label>
                  <Input id="radius" type="number" defaultValue="5" className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rarity" className="text-gray-300">
                    Редкость
                  </Label>
                  <select
                    id="rarity"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                  >
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                    <option value="Epic">Epic</option>
                    <option value="Legendary">Legendary</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-400 text-white">
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить фрагмент
                </Button>
                <Button variant="outline" className="border-white/20 text-white bg-transparent">
                  Отмена
                </Button>
              </div>
            </div>

            {/* Existing Fragments */}
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Существующие фрагменты</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10 bg-white/5 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">ID</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Карточка</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Тип</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Координаты</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Собрано</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-400">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {[
                      {
                        id: "m1a",
                        card: "museum-1",
                        type: "A",
                        lat: 42.8746,
                        lng: 74.6122,
                        collected: 45,
                      },
                      {
                        id: "m1b",
                        card: "museum-1",
                        type: "B",
                        lat: 42.8756,
                        lng: 74.6132,
                        collected: 38,
                      },
                      {
                        id: "m1c",
                        card: "museum-1",
                        type: "C",
                        lat: 42.8766,
                        lng: 74.6142,
                        collected: 42,
                      },
                    ].map((fragment, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-3 text-white font-mono text-sm">{fragment.id}</td>
                        <td className="px-6 py-3 text-gray-400">{fragment.card}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
                              fragment.type === "A"
                                ? "bg-red-500"
                                : fragment.type === "B"
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                            }`}
                          >
                            {fragment.type}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-400 font-mono text-xs">
                          {fragment.lat.toFixed(4)}, {fragment.lng.toFixed(4)}
                        </td>
                        <td className="px-6 py-3 text-gray-400">{fragment.collected} раз</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Управление пользователями</h2>
              <div className="flex gap-3">
                <Input
                  placeholder="Поиск по никнейму или email..."
                  className="w-64 bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6">
                <div className="text-3xl font-bold text-white mb-2">1,247</div>
                <div className="text-sm text-gray-400">Всего пользователей</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6">
                <div className="text-3xl font-bold text-white mb-2">892</div>
                <div className="text-sm text-gray-400">Активных за 7 дней</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-red-500/10 to-orange-500/10 p-6">
                <div className="text-3xl font-bold text-white mb-2">12</div>
                <div className="text-sm text-gray-400">Заблокированных</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Пользователь</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Карточек</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Баланс</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Статус</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    {
                      nickname: "HistoryBuff",
                      email: "history@example.com",
                      cards: 12,
                      balance: "5,200 SHD",
                      status: "active",
                    },
                    {
                      nickname: "ArtCollector",
                      email: "art@example.com",
                      cards: 8,
                      balance: "3,450 SHD",
                      status: "active",
                    },
                    {
                      nickname: "Spammer123",
                      email: "spam@example.com",
                      cards: 2,
                      balance: "120 SHD",
                      status: "blocked",
                    },
                  ].map((user, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{user.nickname}</td>
                      <td className="px-6 py-4 text-gray-400">{user.email}</td>
                      <td className="px-6 py-4 text-gray-400">{user.cards}</td>
                      <td className="px-6 py-4 text-gray-400">{user.balance}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            user.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {user.status === "active" ? "Активен" : "Заблокирован"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className={
                              user.status === "active"
                                ? "text-red-400 hover:text-red-300"
                                : "text-green-400 hover:text-green-300"
                            }
                          >
                            <ShieldAlert className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Модерация листингов</h2>

            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">NFT</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Продавец</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Цена</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Дата</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    {
                      nft: "Око прошлого",
                      seller: "HistoryBuff",
                      price: "5,200 SHD",
                      date: "2 часа назад",
                    },
                    {
                      nft: "Призрак художника",
                      seller: "ArtCollector",
                      price: "4,800 SHD",
                      date: "5 часов назад",
                    },
                  ].map((listing, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{listing.nft}</td>
                      <td className="px-6 py-4 text-gray-400">{listing.seller}</td>
                      <td className="px-6 py-4 text-gray-400">{listing.price}</td>
                      <td className="px-6 py-4 text-gray-400">{listing.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                            Одобрить
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500 text-red-400 bg-transparent">
                            Отклонить
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Настройки платформы</h2>

            <div className="grid gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-lg font-bold text-white">Параметры чекина</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="checkinRadius" className="text-gray-300">
                      Радиус чекина (метры)
                    </Label>
                    <Input
                      id="checkinRadius"
                      type="number"
                      defaultValue="5"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="holdDuration" className="text-gray-300">
                      Время удержания (секунды)
                    </Label>
                    <Input
                      id="holdDuration"
                      type="number"
                      defaultValue="3"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAccuracy" className="text-gray-300">
                      Макс. погрешность GPS (метры)
                    </Label>
                    <Input
                      id="maxAccuracy"
                      type="number"
                      defaultValue="15"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxSpeed" className="text-gray-300">
                      Макс. скорость (м/с)
                    </Label>
                    <Input
                      id="maxSpeed"
                      type="number"
                      step="0.1"
                      defaultValue="2.5"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-lg font-bold text-white">Экономика</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="marketplaceFee" className="text-gray-300">
                      Комиссия маркетплейса (%)
                    </Label>
                    <Input
                      id="marketplaceFee"
                      type="number"
                      defaultValue="5"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="craftCost" className="text-gray-300">
                      Стоимость крафта (SHD)
                    </Label>
                    <Input
                      id="craftCost"
                      type="number"
                      defaultValue="0"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-400 text-white">
                <Save className="mr-2 h-4 w-4" />
                Сохранить настройки
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
