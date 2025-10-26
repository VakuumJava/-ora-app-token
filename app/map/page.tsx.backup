"use client"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { MapPin, X } from "lucide-react"
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

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFragment, setSelectedFragment] = useState<FragmentSpawn | null>(null)
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
    script.async = true
    
    script.onload = () => {
      window.ymaps.ready(() => {
        if (!mapRef.current) return
        
        const ymap = new window.ymaps.Map(mapRef.current, {
          center: [42.875964, 74.603701],
          zoom: 12,
          controls: ['zoomControl']
        })
        
        ymap.setType('yandex#dark')
        
        fragmentSpawns.forEach((spawn) => {
          const placemark = new window.ymaps.Placemark(
            [spawn.lat, spawn.lng],
            {
              hintContent: spawn.name,
              balloonContent: '<div style="padding: 8px;"><strong>' + spawn.name + '</strong><br/>Фрагмент ' + spawn.fragment + ' • ' + spawn.rarity + '<br/><span style="color: ' + (spawn.available ? '#10b981' : '#ef4444') + '">' + (spawn.available ? 'Доступно' : 'Собрано') + '</span></div>'
            },
            {
              preset: 'islands#circleDotIcon',
              iconColor: fragmentColors[spawn.fragment]
            }
          )
          
          placemark.events.add('click', () => setSelectedFragment(spawn))
          ymap.geoObjects.add(placemark)
        })
        
        setMap(ymap)
        setLoading(false)
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const userMark = new window.ymaps.Placemark(
              [pos.coords.latitude, pos.coords.longitude],
              { hintContent: 'Вы здесь' },
              {
                iconLayout: 'default#image',
                iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iIzM4OGFFOCIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxMiIgZmlsbD0iIzM4OGFFOCIvPgogIDxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjYiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
                iconImageSize: [40, 40],
                iconImageOffset: [-20, -20]
              }
            )
            ymap.geoObjects.add(userMark)
          })
        }
      })
    }
    
    document.head.appendChild(script)
    
    return () => {
      if (map) {
        map.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (!map || !window.ymaps) return
    
    map.geoObjects.removeAll()
    
    const filtered = selectedChain 
      ? fragmentSpawns.filter(f => f.chain === selectedChain)
      : fragmentSpawns
    
    filtered.forEach((spawn) => {
      const placemark = new window.ymaps.Placemark(
        [spawn.lat, spawn.lng],
        {
          hintContent: spawn.name,
          balloonContent: '<div style="padding: 8px;"><strong>' + spawn.name + '</strong><br/>Фрагмент ' + spawn.fragment + ' • ' + spawn.rarity + '<br/><span style="color: ' + (spawn.available ? '#10b981' : '#ef4444') + '">' + (spawn.available ? 'Доступно' : 'Собрано') + '</span></div>'
        },
        {
          preset: 'islands#circleDotIcon',
          iconColor: fragmentColors[spawn.fragment]
        }
      )
      
      placemark.events.add('click', () => setSelectedFragment(spawn))
      map.geoObjects.add(placemark)
    })
  }, [selectedChain, map])

  return (
    <div className="flex h-screen flex-col bg-black">
      <SiteHeader />
      
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/80 px-6 py-3 backdrop-blur-xl z-10">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Карта фрагментов
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedChain(null)}
            className={selectedChain === null ? "bg-blue-500/20 text-blue-300" : ""}
          >
            Все
          </Button>
          {(["TON", "ETH", "BASE"] as Chain[]).map((chain) => (
            <Button 
              key={chain}
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedChain(chain)}
              className={selectedChain === chain ? "bg-blue-500/20 text-blue-300" : ""}
            >
              {chain}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="relative flex-1">
        <div ref={mapRef} className="w-full h-full" />
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90">
            <div className="text-center text-white">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 mx-auto" />
              <p>Загрузка карты...</p>
            </div>
          </div>
        )}
        
        {selectedFragment && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md rounded-2xl border border-white/10 bg-black/90 backdrop-blur-2xl p-6 z-30">
            <button 
              onClick={() => setSelectedFragment(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="text-xs text-gray-400 mb-1">{selectedFragment.chain}</div>
            <h3 className="text-xl font-bold text-white mb-3">{selectedFragment.name}</h3>
            
            <div className="flex gap-2 mb-4">
              <span 
                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: fragmentColors[selectedFragment.fragment] }}
              >
                Фрагмент {selectedFragment.fragment}
              </span>
              <span 
                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: rarityColors[selectedFragment.rarity] }}
              >
                {selectedFragment.rarity}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>{selectedFragment.lat.toFixed(4)}, {selectedFragment.lng.toFixed(4)}</span>
              </div>
              <div className="mt-3 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                <div className="text-xs text-blue-300 mb-1">Требования для чекина:</div>
                <div className="text-xs text-gray-400">• Радиус: 5 метров</div>
                <div className="text-xs text-gray-400">• Удержание: 3 секунды</div>
              </div>
            </div>
            
            {selectedFragment.available && (
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Начать чекин
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
