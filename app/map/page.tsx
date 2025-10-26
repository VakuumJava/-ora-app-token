"use client"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Sparkles, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

type Fragment = "A" | "B" | "C" | "D" | "E"
type Rarity = "Common" | "Rare" | "Epic" | "Legendary"
type Chain = "TON" | "ETH" | "BASE"

interface FragmentSpawn {
  id: string
  lat: number
  lng: number
  fragment: Fragment
  rarity: Rarity
  chain: Chain
  name: string
  available: boolean
}

declare global {
  interface Window {
    ymaps: any
  }
}

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const userPlacemark = useRef<any>(null)
  const [selectedFragment, setSelectedFragment] = useState<FragmentSpawn | null>(null)
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapType, setMapType] = useState<'map' | 'satellite' | 'hybrid'>('map')

  const fragmentSpawns: FragmentSpawn[] = [
    { id: "1", lat: 42.8746, lng: 74.5698, fragment: "A", rarity: "Common", chain: "TON", name: "Ошская — площадь Ала-Тоо", available: true },
    { id: "2", lat: 42.8796, lng: 74.6054, fragment: "B", rarity: "Rare", chain: "ETH", name: "ТРЦ Вефа Центр", available: true },
    { id: "3", lat: 42.8653, lng: 74.5847, fragment: "C", rarity: "Epic", chain: "BASE", name: "Дубовый парк", available: false },
    { id: "4", lat: 42.8432, lng: 74.5856, fragment: "D", rarity: "Legendary", chain: "TON", name: "ТРЦ Асия Молл", available: true },
    { id: "5", lat: 42.8587, lng: 74.6169, fragment: "E", rarity: "Rare", chain: "ETH", name: "Парк имени Панфилова", available: true },
    { id: "6", lat: 42.8676, lng: 74.5874, fragment: "A", rarity: "Epic", chain: "BASE", name: "Технопарк", available: true },
  ]

  const fragmentColors: Record<Fragment, string> = {
    A: "#3b82f6", B: "#8b5cf6", C: "#ec4899", D: "#f59e0b", E: "#10b981",
  }

  const rarityColors: Record<Rarity, string> = {
    Common: "#9ca3af", Rare: "#3b82f6", Epic: "#a855f7", Legendary: "#f59e0b",
  }

  const filteredFragments = selectedChain
    ? fragmentSpawns.filter((frag) => frag.chain === selectedChain)
    : fragmentSpawns

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
    script.async = true
    script.onload = () => initMap()
    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (mapInstance.current && window.ymaps) {
      mapInstance.current.geoObjects.removeAll()
      if (userPlacemark.current) {
        mapInstance.current.geoObjects.add(userPlacemark.current)
      }
      filteredFragments.forEach((spawn) => {
        const placemark = new window.ymaps.Placemark(
          [spawn.lat, spawn.lng],
          { hintContent: spawn.name, balloonContent: `<div style="padding: 8px;"><strong>${spawn.name}</strong><br/>Фрагмент ${spawn.fragment} • ${spawn.rarity}<br/><span style="color: ${spawn.available ? '#10b981' : '#ef4444'}">${spawn.available ? 'Доступно' : 'Собрано'}</span></div>` },
          { preset: 'islands#circleDotIcon', iconColor: fragmentColors[spawn.fragment] }
        )
        placemark.events.add('click', () => { setSelectedFragment(spawn) })
        mapInstance.current.geoObjects.add(placemark)
      })
    }
  }, [selectedChain, filteredFragments])

  const initMap = () => {
    if (!window.ymaps || !mapContainer.current || mapInstance.current) return
    window.ymaps.ready(() => {
      const startCenter = [42.875964, 74.603701]
      mapInstance.current = new window.ymaps.Map(mapContainer.current, { center: startCenter, zoom: 12, type: 'yandex#dark', controls: ['zoomControl'] })
      setIsLoading(false)
      filteredFragments.forEach((spawn) => {
        const placemark = new window.ymaps.Placemark(
          [spawn.lat, spawn.lng],
          { hintContent: spawn.name, balloonContent: `<div style="padding: 8px;"><strong>${spawn.name}</strong><br/>Фрагмент ${spawn.fragment} • ${spawn.rarity}<br/><span style="color: ${spawn.available ? '#10b981' : '#ef4444'}">${spawn.available ? 'Доступно' : 'Собрано'}</span></div>` },
          { preset: 'islands#circleDotIcon', iconColor: fragmentColors[spawn.fragment] }
        )
        placemark.events.add('click', () => { setSelectedFragment(spawn) })
        mapInstance.current.geoObjects.add(placemark)
      })
      locateUser()
    })
  }

  const locateUser = () => {
    if (!navigator.geolocation) { alert("Ваш браузер не поддерживает геолокацию"); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude]
        if (userPlacemark.current) {
          userPlacemark.current.geometry.setCoordinates(coords)
        } else {
          userPlacemark.current = new window.ymaps.Placemark(
            coords, 
            { hintContent: 'Вы здесь', balloonContent: '<div style="padding: 8px;"><strong>📍 Ваша локация</strong><br/>Вы находитесь здесь</div>' }, 
            { 
              iconLayout: 'default#image',
              iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iIzM4OGFFOCIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxMiIgZmlsbD0iIzM4OGFFOCIvPgogIDxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjYiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
              iconImageSize: [40, 40],
              iconImageOffset: [-20, -20]
            }
          )
          mapInstance.current?.geoObjects.add(userPlacemark.current)
        }
        mapInstance.current?.setCenter(coords, 15)
      },
      (err) => {
        let msg = "Ошибка определения местоположения"
        if (err.code === 1) msg = "Доступ к геолокации запрещён."
        else if (err.code === 2) msg = "Информация о местоположении недоступна."
        else if (err.code === 3) msg = "Превышено время ожидания."
        console.error(msg, err)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const changeMapType = (type: 'map' | 'satellite' | 'hybrid') => {
    if (!mapInstance.current) return
    const typeMap = { map: 'yandex#dark', satellite: 'yandex#satellite', hybrid: 'yandex#hybrid' }
    mapInstance.current.setType(typeMap[type])
    setMapType(type)
  }

  return (
    <div className="flex h-screen flex-col bg-black relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full animate-twinkle" style={{ width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.2 + Math.random() * 0.5, animationDelay: `${Math.random() * 3}s`, animationDuration: `${2 + Math.random() * 3}s` }} />
        ))}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>
      <style jsx>{`@keyframes twinkle { 0%, 100% { opacity: 0.1; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } } .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }`}</style>
      <SiteHeader />
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/80 px-6 py-3 backdrop-blur-xl z-10 shadow-lg shadow-black/50">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          Карта фрагментов
        </h1>
        <div className="flex gap-3">
          <div className="flex gap-2 mr-4">
            <Button variant="outline" size="sm" onClick={() => changeMapType('map')} className={`h-9 rounded-lg border-white/20 px-4 text-sm backdrop-blur-sm transition-all hover:border-white/30 ${mapType === 'map' ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30" : "text-white/90 hover:bg-white/10 bg-white/5"}`}>Обычная</Button>
            <Button variant="outline" size="sm" onClick={() => changeMapType('satellite')} className={`h-9 rounded-lg border-white/20 px-4 text-sm backdrop-blur-sm transition-all hover:border-white/30 ${mapType === 'satellite' ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30" : "text-white/90 hover:bg-white/10 bg-white/5"}`}>Спутник</Button>
            <Button variant="outline" size="sm" onClick={() => changeMapType('hybrid')} className={`h-9 rounded-lg border-white/20 px-4 text-sm backdrop-blur-sm transition-all hover:border-white/30 ${mapType === 'hybrid' ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30" : "text-white/90 hover:bg-white/10 bg-white/5"}`}>Гибрид</Button>
            <Button variant="outline" size="sm" onClick={locateUser} className="h-9 rounded-lg border-white/20 px-4 text-sm text-white/90 hover:bg-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/30">📍 Моя локация</Button>
          </div>
          <Button variant="outline" size="sm" className="h-9 rounded-lg border-white/20 px-4 text-sm text-white/90 hover:bg-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/30" onClick={() => setSelectedChain(null)}>Все</Button>
          {(["TON", "ETH", "BASE"] as Chain[]).map((chain) => (
            <Button key={chain} variant="outline" size="sm" onClick={() => setSelectedChain(chain)} className={`h-9 rounded-lg border-white/20 px-4 text-sm backdrop-blur-sm transition-all hover:border-white/30 ${selectedChain === chain ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30" : "text-white/90 hover:bg-white/10 bg-white/5"}`}>{chain}</Button>
          ))}
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {isLoading && (
          <div className="flex h-full items-center justify-center text-white bg-black">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 mx-auto" />
              <p className="text-sm text-gray-400">Загрузка карты...</p>
            </div>
          </div>
        )}
        <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
        {selectedFragment && (
          <div className="absolute bottom-6 left-1/2 w-full max-w-md -translate-x-1/2 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-2xl z-30 shadow-2xl shadow-black/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
            <div className="relative p-6">
              <button onClick={() => setSelectedFragment(null)} className="absolute right-4 top-4 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-all"><X className="h-4 w-4" /></button>
              <div className="mb-4 flex items-start justify-between pr-8">
                <div>
                  <div className="mb-1 text-xs text-gray-400">{selectedFragment.chain}</div>
                  <h3 className="text-xl font-bold text-white">{selectedFragment.name}</h3>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg" style={{ background: fragmentColors[selectedFragment.fragment as keyof typeof fragmentColors] }}>Фрагмент {selectedFragment.fragment}</span>
                    <span className="rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg" style={{ background: rarityColors[selectedFragment.rarity as keyof typeof rarityColors] }}>{selectedFragment.rarity}</span>
                  </div>
                </div>
              </div>
              <div className="mb-4 space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-400" /><span>{selectedFragment.lat.toFixed(4)}, {selectedFragment.lng.toFixed(4)}</span></div>
                <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-blue-400" /><span>{selectedFragment.available ? "Доступно сейчас" : "Уже собрано"}</span></div>
                <div className="mt-3 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                  <div className="text-xs text-blue-300 mb-1">Требования для чекина:</div>
                  <div className="text-xs text-gray-400">• Радиус: 5 метров</div>
                  <div className="text-xs text-gray-400">• Удержание: 3 секунды</div>
                </div>
              </div>
              {selectedFragment.available ? (
                <Link href={`/checkin/${selectedFragment.id}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"><Navigation className="mr-2 h-4 w-4" />Начать чекин</Button>
                </Link>
              ) : (
                <Button disabled className="w-full" variant="secondary">Уже собрано</Button>
              )}
            </div>
          </div>
        )}
        <div className="absolute right-6 top-6 rounded-xl border border-white/20 bg-black/80 p-4 backdrop-blur-md z-10">
          <div className="mb-2 text-xs text-gray-400">Доступно фрагментов</div>
          <div className="text-3xl font-bold text-white">{filteredFragments.filter((frag) => frag.available).length}</div>
          <div className="mt-1 text-xs text-gray-400">из {filteredFragments.length} в радиусе</div>
        </div>
        <div className="absolute bottom-6 left-6 rounded-xl border border-white/20 bg-black/80 p-4 backdrop-blur-md z-10">
          <div className="mb-3 text-xs font-medium text-white">Тип фрагмента</div>
          <div className="space-y-2 mb-4">
            {Object.entries(fragmentColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ background: color }} /><span className="text-xs text-gray-300">Фрагмент {type}</span></div>
            ))}
          </div>
          <div className="mb-3 text-xs font-medium text-white border-t border-white/10 pt-3">Редкость</div>
          <div className="space-y-2">
            {Object.entries(rarityColors).map(([rarity, color]) => (
              <div key={rarity} className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ background: color }} /><span className="text-xs text-gray-300">{rarity}</span></div>
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } } [class*="ymaps"] { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }`}</style>
    </div>
  )
}
