"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { 
  LayoutDashboard, Package, CreditCard, Gem, MapPin, Zap, ShoppingCart, 
  Users, Code, Settings, FileText, Plus, Edit, Trash2, Eye, EyeOff, 
  Save, Upload, Download, CheckCircle, XCircle, ShieldAlert, TrendingUp 
} from "lucide-react"

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-red-500/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-32 left-1/3 w-96 h-96 bg-blue-500/15 rounded-full blur-[130px]" />
      </div>

      <SiteHeader />
      
      {/* Admin Badge */}
      <div className="pt-20 pb-4 border-b border-white/10 bg-black/80 relative z-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white">
              <ShieldAlert className="h-4 w-4" />
              ADMIN PANEL
            </span>
            <div className="text-sm text-gray-400">
              Роль: <span className="text-white font-medium">Owner</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 bg-white/5 border border-white/10 grid grid-cols-5 lg:grid-cols-11 gap-2">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500">
              <LayoutDashboard className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="collections" className="data-[state=active]:bg-blue-500">
              <Package className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="cards" className="data-[state=active]:bg-blue-500">
              <CreditCard className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="shards" className="data-[state=active]:bg-blue-500">
              <Gem className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="spawn" className="data-[state=active]:bg-blue-500">
              <MapPin className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="drops" className="data-[state=active]:bg-blue-500">
              <Zap className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-blue-500">
              <ShoppingCart className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-500">
              <Users className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="web3" className="data-[state=active]:bg-blue-500">
              <Code className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-500">
              <Settings className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-blue-500">
              <FileText className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">Дашборд</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Чек-ины сегодня</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">127</div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +12% от вчера
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Собрано карточек</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">42</div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +8% от вчера
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Активные листинги</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">89</div>
                  <p className="text-xs text-gray-400 mt-2">На маркетплейсе</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Сделок сегодня</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">15</div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +25% от вчера
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Карта точек</CardTitle>
                <CardDescription className="text-gray-400">Активные точки спавна осколков</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                  <p className="text-gray-400">Карта с точками спавна (интеграция Mapbox/Leaflet)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Коллекции</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-400">
                    <Plus className="mr-2 h-4 w-4" />
                    Создать коллекцию
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-white">Новая коллекция</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Создайте новую коллекцию NFT карточек
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Название</Label>
                      <Input id="name" placeholder="Urban Relics" className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-white">Описание</Label>
                      <Textarea id="description" placeholder="Описание коллекции..." className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="cover" className="text-white">Обложка (URL)</Label>
                      <Input id="cover" placeholder="https://..." className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="chain" className="text-white">Сеть</Label>
                        <Input id="chain" defaultValue="ethereum" className="bg-white/5 border-white/10 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="royalty" className="text-white">Роялти %</Label>
                        <Input id="royalty" type="number" defaultValue="0" className="bg-white/5 border-white/10 text-white" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="border-white/10 text-white">Отмена</Button>
                    <Button className="bg-blue-500">Создать</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-white/5 border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Название</TableHead>
                    <TableHead className="text-gray-400">Описание</TableHead>
                    <TableHead className="text-gray-400">Сеть</TableHead>
                    <TableHead className="text-gray-400">Роялти</TableHead>
                    <TableHead className="text-gray-400">Статус</TableHead>
                    <TableHead className="text-gray-400 text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-white/10">
                    <TableCell className="font-medium text-white">Urban Relics</TableCell>
                    <TableCell className="text-gray-400">Городские артефакты</TableCell>
                    <TableCell className="text-gray-400">Ethereum</TableCell>
                    <TableCell className="text-gray-400">5%</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Активна
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Карточки</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-400">
                    <Plus className="mr-2 h-4 w-4" />
                    Создать карточку
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">Новая карточка</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Создайте карточку. Автоматически создастся 3 осколка.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="collection_id" className="text-white">Коллекция</Label>
                      <Input id="collection_id" placeholder="Выберите коллекцию..." className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="card_name" className="text-white">Название карточки</Label>
                      <Input id="card_name" placeholder="Старинный компас" className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="card_description" className="text-white">Описание</Label>
                      <Textarea id="card_description" placeholder="Описание карточки..." className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="supply_cap" className="text-white">Лимит тиража</Label>
                        <Input id="supply_cap" type="number" defaultValue="1000" className="bg-white/5 border-white/10 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="rarity" className="text-white">Редкость</Label>
                        <Input id="rarity" defaultValue="common" className="bg-white/5 border-white/10 text-white" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="card_image" className="text-white">Изображение карточки (URL)</Label>
                      <Input id="card_image" placeholder="https://..." className="bg-white/5 border-white/10 text-white" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="border-white/10 text-white">Отмена</Button>
                    <Button className="bg-blue-500">Создать</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-white/5 border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Название</TableHead>
                    <TableHead className="text-gray-400">Коллекция</TableHead>
                    <TableHead className="text-gray-400">Редкость</TableHead>
                    <TableHead className="text-gray-400">Лимит</TableHead>
                    <TableHead className="text-gray-400">Выпущено</TableHead>
                    <TableHead className="text-gray-400">Осколков</TableHead>
                    <TableHead className="text-gray-400 text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-white/10">
                    <TableCell className="font-medium text-white">Старинный компас</TableCell>
                    <TableCell className="text-gray-400">Urban Relics</TableCell>
                    <TableCell className="text-gray-400">Rare</TableCell>
                    <TableCell className="text-gray-400">1000</TableCell>
                    <TableCell className="text-gray-400">234</TableCell>
                    <TableCell className="text-gray-400">3 / 3</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Shards Tab */}
          <TabsContent value="shards" className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Осколки</h2>
            <p className="text-gray-400">Загрузите изображения и иконки для 3 осколков каждой карточки</p>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Старинный компас - Осколки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="border border-white/10 rounded-lg p-4 bg-white/5">
                      <h3 className="text-white font-medium mb-3">Осколок {index}</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-gray-400 text-sm">Изображение</Label>
                          <Input placeholder="https://..." className="bg-white/5 border-white/10 text-white mt-1" />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-sm">Иконка для карты</Label>
                          <Input placeholder="https://..." className="bg-white/5 border-white/10 text-white mt-1" />
                        </div>
                        <Button size="sm" className="w-full bg-blue-500">
                          <Save className="h-3 w-3 mr-2" />
                          Сохранить
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spawn Points Tab */}
          <TabsContent value="spawn" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Точки спавна</h2>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-white/10 text-white">
                      <Upload className="mr-2 h-4 w-4" />
                      Импорт CSV
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-white">Импорт точек из CSV</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Формат: lat,lng,count,from,to
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white">Осколок</Label>
                        <Input placeholder="Выберите осколок..." className="bg-white/5 border-white/10 text-white" />
                      </div>
                      <div>
                        <Label className="text-white">CSV данные</Label>
                        <Textarea 
                          rows={8}
                          placeholder="55.7558,37.6173,1,2025-01-01,2025-12-31&#10;55.7600,37.6200,2,2025-01-01,2025-12-31"
                          className="bg-white/5 border-white/10 text-white font-mono text-xs"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" className="border-white/10 text-white">Отмена</Button>
                      <Button className="bg-blue-500">Импортировать</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-400">
                      <Plus className="mr-2 h-4 w-4" />
                      Добавить точку
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-white">Новая точка спавна</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Кликните на карте или введите координаты
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white">Осколок</Label>
                        <Input placeholder="Выберите осколок..." className="bg-white/5 border-white/10 text-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white">Широта</Label>
                          <Input type="number" step="0.000001" placeholder="55.7558" className="bg-white/5 border-white/10 text-white" />
                        </div>
                        <div>
                          <Label className="text-white">Долгота</Label>
                          <Input type="number" step="0.000001" placeholder="37.6173" className="bg-white/5 border-white/10 text-white" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white">Количество</Label>
                          <Input type="number" defaultValue="1" className="bg-white/5 border-white/10 text-white" />
                        </div>
                        <div>
                          <Label className="text-white">Радиус (м)</Label>
                          <Input type="number" defaultValue="5" className="bg-white/5 border-white/10 text-white" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white">Начало</Label>
                          <Input type="datetime-local" className="bg-white/5 border-white/10 text-white" />
                        </div>
                        <div>
                          <Label className="text-white">Конец</Label>
                          <Input type="datetime-local" className="bg-white/5 border-white/10 text-white" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" className="border-white/10 text-white">Отмена</Button>
                      <Button className="bg-blue-500">Создать</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Осколок</TableHead>
                    <TableHead className="text-gray-400">Координаты</TableHead>
                    <TableHead className="text-gray-400">Кол-во</TableHead>
                    <TableHead className="text-gray-400">Осталось</TableHead>
                    <TableHead className="text-gray-400">Период</TableHead>
                    <TableHead className="text-gray-400">Статус</TableHead>
                    <TableHead className="text-gray-400 text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-white/10">
                    <TableCell className="text-white">Компас - Осколок 1</TableCell>
                    <TableCell className="text-gray-400 font-mono text-xs">55.7558, 37.6173</TableCell>
                    <TableCell className="text-gray-400">10</TableCell>
                    <TableCell className="text-gray-400">7</TableCell>
                    <TableCell className="text-gray-400 text-xs">2025-01-01 до 2025-12-31</TableCell>
                    <TableCell>
                      <Switch defaultChecked />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Drops Tab */}
          <TabsContent value="drops" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Дропы (расписания)</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-400">
                <Plus className="mr-2 h-4 w-4" />
                Создать дроп
              </Button>
            </div>

            <Card className="bg-white/5 border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Название</TableHead>
                    <TableHead className="text-gray-400">Описание</TableHead>
                    <TableHead className="text-gray-400">Период</TableHead>
                    <TableHead className="text-gray-400">Точек</TableHead>
                    <TableHead className="text-gray-400">Статус</TableHead>
                    <TableHead className="text-gray-400 text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-white/10">
                    <TableCell className="font-medium text-white">Зимний дроп</TableCell>
                    <TableCell className="text-gray-400">Праздничная акция</TableCell>
                    <TableCell className="text-gray-400 text-xs">2025-12-20 до 2025-12-31</TableCell>
                    <TableCell className="text-gray-400">15</TableCell>
                    <TableCell>
                      <Switch defaultChecked />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Маркетплейс</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Настройки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Комиссия платформы (%)</Label>
                    <Input type="number" defaultValue="5" className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div>
                    <Label className="text-white">Минимальная цена</Label>
                    <Input type="number" defaultValue="0" className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <Button className="w-full bg-blue-500">
                    <Save className="mr-2 h-4 w-4" />
                    Сохранить настройки
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Статистика</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Активных листингов</span>
                    <span className="text-white font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Забаненных</span>
                    <span className="text-white font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Продано сегодня</span>
                    <span className="text-white font-medium">15</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Модерация листингов</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-gray-400">Карточка</TableHead>
                      <TableHead className="text-gray-400">Продавец</TableHead>
                      <TableHead className="text-gray-400">Цена</TableHead>
                      <TableHead className="text-gray-400">Создан</TableHead>
                      <TableHead className="text-gray-400">Статус</TableHead>
                      <TableHead className="text-gray-400 text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-white/10">
                      <TableCell className="text-white">Старинный компас</TableCell>
                      <TableCell className="text-gray-400">user@mail.com</TableCell>
                      <TableCell className="text-gray-400">0.05 ETH</TableCell>
                      <TableCell className="text-gray-400 text-xs">2025-01-15 14:30</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                          Active
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Пользователи</h2>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Поиск пользователя</CardTitle>
              </CardHeader>
              <CardContent>
                <Input 
                  placeholder="Email, никнейм или кошелёк..." 
                  className="bg-white/5 border-white/10 text-white"
                />
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Никнейм</TableHead>
                    <TableHead className="text-gray-400">Осколков</TableHead>
                    <TableHead className="text-gray-400">Карточек</TableHead>
                    <TableHead className="text-gray-400">Листингов</TableHead>
                    <TableHead className="text-gray-400 text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-white/10">
                    <TableCell className="text-white">user@example.com</TableCell>
                    <TableCell className="text-gray-400">Explorer123</TableCell>
                    <TableCell className="text-gray-400">8</TableCell>
                    <TableCell className="text-gray-400">2</TableCell>
                    <TableCell className="text-gray-400">1</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Web3 Tab */}
          <TabsContent value="web3" className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Web3 / Контракты</h2>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Конфигурация контракта</CardTitle>
                <CardDescription className="text-gray-400">
                  Настройте подключение к смарт-контракту NFT
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Сеть</Label>
                  <Input defaultValue="ethereum" className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <Label className="text-white">RPC URL</Label>
                  <Input placeholder="https://..." className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <Label className="text-white">Адрес контракта</Label>
                  <Input placeholder="0x..." className="bg-white/5 border-white/10 text-white font-mono" />
                </div>
                <div>
                  <Label className="text-white">ABI контракта (JSON)</Label>
                  <Textarea 
                    rows={6}
                    placeholder='[{"inputs":[],"name":"mint"...}]'
                    className="bg-white/5 border-white/10 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <Label className="text-white">Функция минта</Label>
                  <Input defaultValue="mintTo" placeholder="mintTo или safeMint" className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="flex gap-4">
                  <Button className="bg-blue-500 flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    Сохранить конфигурацию
                  </Button>
                  <Button variant="outline" className="border-white/10 text-white">
                    <Zap className="mr-2 h-4 w-4" />
                    Test Mint
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Настройки</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Параметры чек-ина</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Радиус чек-ина (метры)</Label>
                    <Input type="number" defaultValue="5" className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div>
                    <Label className="text-white">Время удержания (секунды)</Label>
                    <Input type="number" defaultValue="3" className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <Button className="w-full bg-blue-500">
                    <Save className="mr-2 h-4 w-4" />
                    Сохранить
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Администраторы</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white text-sm">admin@example.com</p>
                        <p className="text-gray-400 text-xs">Owner</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-white/10 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить администратора
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Логи аудита</h2>

            <Card className="bg-white/5 border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Время</TableHead>
                    <TableHead className="text-gray-400">Пользователь</TableHead>
                    <TableHead className="text-gray-400">Действие</TableHead>
                    <TableHead className="text-gray-400">Сущность</TableHead>
                    <TableHead className="text-gray-400 text-right">Детали</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-white/10">
                    <TableCell className="text-gray-400 text-xs">2025-10-25 15:32:10</TableCell>
                    <TableCell className="text-white">admin@example.com</TableCell>
                    <TableCell className="text-gray-400">create_collection</TableCell>
                    <TableCell className="text-gray-400">collections</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-white/10">
                    <TableCell className="text-gray-400 text-xs">2025-10-25 15:28:45</TableCell>
                    <TableCell className="text-white">admin@example.com</TableCell>
                    <TableCell className="text-gray-400">create_spawn_point</TableCell>
                    <TableCell className="text-gray-400">spawn_points</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
