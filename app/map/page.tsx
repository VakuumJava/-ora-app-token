"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Filter, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"

// NFT drop locations in Bishkek
const dropLocations = [
  // Museum Chain
  { id: 1, chain: "Museum Chain", name: "Зал древностей", lat: 42.8746, lng: 74.6122, rarity: "Rare", available: true },
  {
    id: 2,
    chain: "Museum Chain",
    name: "Камень Орто-Сай",
    lat: 42.8756,
    lng: 74.6132,
    rarity: "Epic",
    available: true,
  },
  { id: 3, chain: "Museum Chain", name: "Панно Манас", lat: 42.8766, lng: 74.6142, rarity: "Epic", available: false },
  {
    id: 4,
    chain: "Museum Chain",
    name: "Око прошлого",
    lat: 42.8776,
    lng: 74.6152,
    rarity: "Legendary",
    available: true,
  },

  // Park Chain
  { id: 5, chain: "Park Chain", name: "Дерево желаний", lat: 42.8786, lng: 74.6062, rarity: "Common", available: true },
  {
    id: 6,
    chain: "Park Chain",
    name: "Фонтан с отражением",
    lat: 42.8696,
    lng: 74.6072,
    rarity: "Uncommon",
    available: true,
  },
  {
    id: 7,
    chain: "Park Chain",
    name: "Старый дуб времени",
    lat: 42.8606,
    lng: 74.6082,
    rarity: "Rare",
    available: true,
  },

  // Spiritual Chain
  {
    id: 8,
    chain: "Spiritual Chain",
    name: "Купол мечети",
    lat: 42.8746,
    lng: 74.5922,
    rarity: "Rare",
    available: true,
  },
  {
    id: 9,
    chain: "Spiritual Chain",
    name: "Колокол собора",
    lat: 42.8756,
    lng: 74.5932,
    rarity: "Rare",
    available: false,
  },

  // Soviet Legacy Chain
  {
    id: 10,
    chain: "Soviet Legacy Chain",
    name: "Мозаика космонавта",
    lat: 42.8646,
    lng: 74.6022,
    rarity: "Common",
    available: true,
  },
  {
    id: 11,
    chain: "Soviet Legacy Chain",
    name: "Барельеф дружбы",
    lat: 42.8656,
    lng: 74.6032,
    rarity: "Uncommon",
    available: true,
  },

  // Street Art Chain
  {
    id: 12,
    chain: "Street Art Chain",
    name: "Тэг у ЦУМа",
    lat: 42.8746,
    lng: 74.6022,
    rarity: "Common",
    available: true,
  },
  {
    id: 13,
    chain: "Street Art Chain",
    name: "Фреска Манас XXI",
    lat: 42.8756,
    lng: 74.6032,
    rarity: "Rare",
    available: true,
  },

  // Modern City Chain
  {
    id: 14,
    chain: "Modern City Chain",
    name: "SkyPoint Reflection",
    lat: 42.8846,
    lng: 74.6122,
    rarity: "Uncommon",
    available: true,
  },
  {
    id: 15,
    chain: "Modern City Chain",
    name: "Башня света",
    lat: 42.8856,
    lng: 74.6132,
    rarity: "Rare",
    available: false,
  },

  // Cultural Chain
  {
    id: 16,
    chain: "Cultural Chain",
    name: "Орнамент с чапана",
    lat: 42.8546,
    lng: 74.6022,
    rarity: "Common",
    available: true,
  },
  {
    id: 17,
    chain: "Cultural Chain",
    name: "Голос комузиста",
    lat: 42.8556,
    lng: 74.6032,
    rarity: "Epic",
    available: true,
  },

  // Urban Life Chain
  {
    id: 18,
    chain: "Urban Life Chain",
    name: "Первая чашка Sierra",
    lat: 42.8746,
    lng: 74.6222,
    rarity: "Common",
    available: true,
  },
  {
    id: 19,
    chain: "Urban Life Chain",
    name: "Утренний дым Navat",
    lat: 42.8756,
    lng: 74.6232,
    rarity: "Uncommon",
    available: true,
  },

  // Transport Chain
  {
    id: 20,
    chain: "Transport Chain",
    name: "Маршрутка #132",
    lat: 42.8646,
    lng: 74.6122,
    rarity: "Uncommon",
    available: true,
  },
  {
    id: 21,
    chain: "Transport Chain",
    name: "Перекрёсток времени",
    lat: 42.8656,
    lng: 74.6132,
    rarity: "Rare",
    available: true,
  },

  // Mountain View Chain
  {
    id: 22,
    chain: "Mountain View Chain",
    name: "Туман над горами",
    lat: 42.8946,
    lng: 74.6122,
    rarity: "Rare",
    available: true,
  },
  {
    id: 23,
    chain: "Mountain View Chain",
    name: "Закат над Ала-Тоо",
    lat: 42.8956,
    lng: 74.6132,
    rarity: "Epic",
    available: false,
  },
  {
    id: 24,
    chain: "Mountain View Chain",
    name: "Вечная вершина",
    lat: 42.8966,
    lng: 74.6142,
    rarity: "Legendary",
    available: true,
  },
]

// Fragment-based system per TZ
const fragmentSpawns = [
  // Museum Chain - Card 1: "Зал древностей"
  {
    id: "m1a",
    cardId: "museum-1",
    fragment: "A",
    name: "Зал древностей (A)",
    lat: 42.8746,
    lng: 74.6122,
    rarity: "Rare",
    available: true,
    chain: "Museum Chain",
  },
  {
    id: "m1b",
    cardId: "museum-1",
    fragment: "B",
    name: "Зал древностей (B)",
    lat: 42.8756,
    lng: 74.6132,
    rarity: "Rare",
    available: true,
    chain: "Museum Chain",
  },
  {
    id: "m1c",
    cardId: "museum-1",
    fragment: "C",
    name: "Зал древностей (C)",
    lat: 42.8766,
    lng: 74.6142,
    rarity: "Rare",
    available: false,
    chain: "Museum Chain",
  },

  // Museum Chain - Card 2: "Камень Орто-Сай"
  {
    id: "m2a",
    cardId: "museum-2",
    fragment: "A",
    name: "Камень Орто-Сай (A)",
    lat: 42.8776,
    lng: 74.6152,
    rarity: "Epic",
    available: true,
    chain: "Museum Chain",
  },
  {
    id: "m2b",
    cardId: "museum-2",
    fragment: "B",
    name: "Камень Орто-Сай (B)",
    lat: 42.8786,
    lng: 74.6162,
    rarity: "Epic",
    available: true,
    chain: "Museum Chain",
  },
  {
    id: "m2c",
    cardId: "museum-2",
    fragment: "C",
    name: "Камень Орто-Сай (C)",
    lat: 42.8796,
    lng: 74.6172,
    rarity: "Epic",
    available: true,
    chain: "Museum Chain",
  },

  // Park Chain - Card 1: "Дерево желаний"
  {
    id: "p1a",
    cardId: "park-1",
    fragment: "A",
    name: "Дерево желаний (A)",
    lat: 42.8786,
    lng: 74.6062,
    rarity: "Common",
    available: true,
    chain: "Park Chain",
  },
  {
    id: "p1b",
    cardId: "park-1",
    fragment: "B",
    name: "Дерево желаний (B)",
    lat: 42.8696,
    lng: 74.6072,
    rarity: "Common",
    available: true,
    chain: "Park Chain",
  },
  {
    id: "p1c",
    cardId: "park-1",
    fragment: "C",
    name: "Дерево желаний (C)",
    lat: 42.8606,
    lng: 74.6082,
    rarity: "Common",
    available: true,
    chain: "Park Chain",
  },

  // Spiritual Chain - Card 1: "Купол мечети"
  {
    id: "s1a",
    cardId: "spiritual-1",
    fragment: "A",
    name: "Купол мечети (A)",
    lat: 42.8746,
    lng: 74.5922,
    rarity: "Rare",
    available: true,
    chain: "Spiritual Chain",
  },
  {
    id: "s1b",
    cardId: "spiritual-1",
    fragment: "B",
    name: "Купол мечети (B)",
    lat: 42.8756,
    lng: 74.5932,
    rarity: "Rare",
    available: false,
    chain: "Spiritual Chain",
  },
  {
    id: "s1c",
    cardId: "spiritual-1",
    fragment: "C",
    name: "Купол мечети (C)",
    lat: 42.8766,
    lng: 74.5942,
    rarity: "Rare",
    available: true,
    chain: "Spiritual Chain",
  },

  // Soviet Legacy Chain
  {
    id: "sl1a",
    cardId: "soviet-1",
    fragment: "A",
    name: "Мозаика космонавта (A)",
    lat: 42.8646,
    lng: 74.6022,
    rarity: "Common",
    available: true,
    chain: "Soviet Legacy Chain",
  },
  {
    id: "sl1b",
    cardId: "soviet-1",
    fragment: "B",
    name: "Мозаика космонавта (B)",
    lat: 42.8656,
    lng: 74.6032,
    rarity: "Common",
    available: true,
    chain: "Soviet Legacy Chain",
  },
  {
    id: "sl1c",
    cardId: "soviet-1",
    fragment: "C",
    name: "Мозаика космонавта (C)",
    lat: 42.8666,
    lng: 74.6042,
    rarity: "Common",
    available: true,
    chain: "Soviet Legacy Chain",
  },

  // Street Art Chain
  {
    id: "sa1a",
    cardId: "street-1",
    fragment: "A",
    name: "Тэг у ЦУМа (A)",
    lat: 42.8746,
    lng: 74.6022,
    rarity: "Common",
    available: true,
    chain: "Street Art Chain",
  },
  {
    id: "sa1b",
    cardId: "street-1",
    fragment: "B",
    name: "Тэг у ЦУМа (B)",
    lat: 42.8756,
    lng: 74.6032,
    rarity: "Common",
    available: true,
    chain: "Street Art Chain",
  },
  {
    id: "sa1c",
    cardId: "street-1",
    fragment: "C",
    name: "Тэг у ЦУМа (C)",
    lat: 42.8766,
    lng: 74.6042,
    rarity: "Common",
    available: true,
    chain: "Street Art Chain",
  },

  // Modern City Chain
  {
    id: "mc1a",
    cardId: "modern-1",
    fragment: "A",
    name: "SkyPoint Reflection (A)",
    lat: 42.8846,
    lng: 74.6122,
    rarity: "Uncommon",
    available: true,
    chain: "Modern City Chain",
  },
  {
    id: "mc1b",
    cardId: "modern-1",
    fragment: "B",
    name: "SkyPoint Reflection (B)",
    lat: 42.8856,
    lng: 74.6132,
    rarity: "Uncommon",
    available: false,
    chain: "Modern City Chain",
  },
  {
    id: "mc1c",
    cardId: "modern-1",
    fragment: "C",
    name: "SkyPoint Reflection (C)",
    lat: 42.8866,
    lng: 74.6142,
    rarity: "Uncommon",
    available: true,
    chain: "Modern City Chain",
  },

  // Cultural Chain
  {
    id: "c1a",
    cardId: "cultural-1",
    fragment: "A",
    name: "Орнамент с чапана (A)",
    lat: 42.8546,
    lng: 74.6022,
    rarity: "Common",
    available: true,
    chain: "Cultural Chain",
  },
  {
    id: "c1b",
    cardId: "cultural-1",
    fragment: "B",
    name: "Орнамент с чапана (B)",
    lat: 42.8556,
    lng: 74.6032,
    rarity: "Common",
    available: true,
    chain: "Cultural Chain",
  },
  {
    id: "c1c",
    cardId: "cultural-1",
    fragment: "C",
    name: "Орнамент с чапана (C)",
    lat: 42.8566,
    lng: 74.6042,
    rarity: "Common",
    available: true,
    chain: "Cultural Chain",
  },

  // Urban Life Chain
  {
    id: "ul1a",
    cardId: "urban-1",
    fragment: "A",
    name: "Первая чашка Sierra (A)",
    lat: 42.8746,
    lng: 74.6222,
    rarity: "Common",
    available: true,
    chain: "Urban Life Chain",
  },
  {
    id: "ul1b",
    cardId: "urban-1",
    fragment: "B",
    name: "Первая чашка Sierra (B)",
    lat: 42.8756,
    lng: 74.6232,
    rarity: "Common",
    available: true,
    chain: "Urban Life Chain",
  },
  {
    id: "ul1c",
    cardId: "urban-1",
    fragment: "C",
    name: "Первая чашка Sierra (C)",
    lat: 42.8766,
    lng: 74.6242,
    rarity: "Common",
    available: true,
    chain: "Urban Life Chain",
  },

  // Transport Chain
  {
    id: "t1a",
    cardId: "transport-1",
    fragment: "A",
    name: "Маршрутка #132 (A)",
    lat: 42.8646,
    lng: 74.6122,
    rarity: "Uncommon",
    available: true,
    chain: "Transport Chain",
  },
  {
    id: "t1b",
    cardId: "transport-1",
    fragment: "B",
    name: "Маршрутка #132 (B)",
    lat: 42.8656,
    lng: 74.6132,
    rarity: "Uncommon",
    available: true,
    chain: "Transport Chain",
  },
  {
    id: "t1c",
    cardId: "transport-1",
    fragment: "C",
    name: "Маршрутка #132 (C)",
    lat: 42.8666,
    lng: 74.6142,
    rarity: "Uncommon",
    available: true,
    chain: "Transport Chain",
  },

  // Mountain View Chain
  {
    id: "mv1a",
    cardId: "mountain-1",
    fragment: "A",
    name: "Закат над Ала-Тоо (A)",
    lat: 42.8946,
    lng: 74.6122,
    rarity: "Epic",
    available: true,
    chain: "Mountain View Chain",
  },
  {
    id: "mv1b",
    cardId: "mountain-1",
    fragment: "B",
    name: "Закат над Ала-Тоо (B)",
    lat: 42.8956,
    lng: 74.6132,
    rarity: "Epic",
    available: false,
    chain: "Mountain View Chain",
  },
  {
    id: "mv1c",
    cardId: "mountain-1",
    fragment: "C",
    name: "Закат над Ала-Тоо (C)",
    lat: 42.8966,
    lng: 74.6142,
    rarity: "Epic",
    available: true,
    chain: "Mountain View Chain",
  },
]

const chains = [
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

const rarityColors = {
  Common: "#6b7280",
  Uncommon: "#22c55e",
  Rare: "#3b82f6",
  Epic: "#a855f7",
  Legendary: "#f59e0b",
}

const fragmentColors = {
  A: "#ef4444",
  B: "#22c55e",
  C: "#3b82f6",
}

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [selectedChain, setSelectedChain] = useState<string | null>(null)
  const [selectedFragment, setSelectedFragment] = useState<(typeof fragmentSpawns)[0] | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainer.current || map.current) return

    console.log("[v0] Initializing map...")

    const initMap = async () => {
      try {
        // @ts-ignore - Leaflet loaded from CDN
        const L = window.L

        if (!L) {
          console.error("[v0] Leaflet not loaded from CDN")
          setIsLoading(false)
          return
        }

        console.log("[v0] Creating map instance...")

        const mapInstance = L.map(mapContainer.current, {
          center: [42.8746, 74.6122],
          zoom: 13,
        })

        map.current = mapInstance

        // Add satellite tiles
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
          attribution: "Esri",
          maxZoom: 19,
        }).addTo(mapInstance)

        // Add street labels
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "OSM",
          maxZoom: 19,
          opacity: 0.4,
        }).addTo(mapInstance)

        console.log("[v0] Adding markers...")

        // Add markers
        fragmentSpawns.forEach((fragment) => {
          const color = fragment.available
            ? fragmentColors[fragment.fragment as keyof typeof fragmentColors]
            : "#374151"

          const marker = L.marker([fragment.lat, fragment.lng], {
            icon: L.divIcon({
              className: "",
              html: `<div style="width: 30px; height: 30px; background: ${color}; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${fragment.fragment}</div>`,
              iconSize: [30, 30],
            }),
          }).addTo(mapInstance)

          marker.on("click", () => {
            setSelectedFragment(fragment)
            mapInstance.setView([fragment.lat, fragment.lng], 16)
          })
        })

        console.log("[v0] Map ready!")
        setIsLoading(false)
      } catch (error) {
        console.error("[v0] Map error:", error)
        setIsLoading(false)
      }
    }

    // Small delay to ensure Leaflet CSS is loaded
    setTimeout(initMap, 100)

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!map.current) return

    import("leaflet").then((L) => {
      // Remove all existing markers
      map.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.current.removeLayer(layer)
        }
      })

      // Add filtered markers
      const filteredFragments = selectedChain
        ? fragmentSpawns.filter((frag) => frag.chain === selectedChain)
        : fragmentSpawns

      filteredFragments.forEach((fragment) => {
        const color = fragment.available ? fragmentColors[fragment.fragment as keyof typeof fragmentColors] : "#374151"

        const marker = L.marker([fragment.lat, fragment.lng], {
          icon: L.divIcon({
            className: "",
            html: `<div style="width: 30px; height: 30px; background: ${color}; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${fragment.fragment}</div>`,
            iconSize: [30, 30],
          }),
        }).addTo(map.current!)

        marker.on("click", () => {
          setSelectedFragment(fragment)
          map.current?.setView([fragment.lat, fragment.lng], 16)
        })
      })

      // Re-add user location marker if exists
      if (userLocation) {
        L.marker(userLocation, {
          icon: L.divIcon({
            className: "",
            html: `<div style="width: 16px; height: 16px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16],
          }),
        }).addTo(map.current!)
      }
    })
  }, [selectedChain, userLocation])

  const handleGetUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude]
          setUserLocation(coords)

          // @ts-ignore
          const L = window.L
          if (L && map.current) {
            L.marker(coords, {
              icon: L.divIcon({
                className: "",
                html: `<div style="width: 16px; height: 16px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
                iconSize: [16, 16],
              }),
            }).addTo(map.current)

            map.current.setView(coords, 15)
          }
        },
        (error) => {
          console.error("[v0] Location error:", error)
          alert("Не удалось получить локацию")
        },
      )
    }
  }

  const filteredFragments = selectedChain
    ? fragmentSpawns.filter((frag) => frag.chain === selectedChain)
    : fragmentSpawns

  return (
    <div className="flex h-screen flex-col bg-black">
      <SiteHeader />

      <div className="flex items-center justify-end gap-3 border-b border-white/10 bg-black/80 px-4 py-2 backdrop-blur-sm z-10">
        <Button
          variant="outline"
          size="sm"
          className="h-7 rounded border-white/20 px-2.5 text-xs text-white hover:bg-white/10 bg-transparent"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-1.5 h-3.5 w-3.5" />
          Фильтры
        </Button>
        <Button
          size="sm"
          className="h-7 rounded bg-gradient-to-r from-blue-500 to-cyan-400 px-2.5 text-xs text-white"
          onClick={handleGetUserLocation}
        >
          <Navigation className="mr-1.5 h-3.5 w-3.5" />
          Моя локация
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Filters Sidebar */}
        {showFilters && (
          <aside className="absolute left-0 top-0 bottom-0 w-80 border-r border-white/10 bg-black/90 p-6 backdrop-blur-md overflow-y-auto z-20">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Цепочки</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedChain(null)}
                className="text-gray-400 hover:text-white"
              >
                Сбросить
              </Button>
            </div>

            <div className="space-y-2">
              {chains.map((chain) => {
                const count = fragmentSpawns.filter((frag) => frag.chain === chain).length
                return (
                  <button
                    key={chain}
                    onClick={() => setSelectedChain(chain === selectedChain ? null : chain)}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      selectedChain === chain
                        ? "border-blue-500 bg-blue-500/20 text-white"
                        : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{chain}</span>
                      <span className="text-xs text-gray-400">{count} фрагментов</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </aside>
        )}

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white">Загрузка карты...</p>
            </div>
          </div>
        ) : (
          <div ref={mapContainer} className="flex-1" style={{ width: "100%", height: "100%" }} />
        )}

        {/* Fragment Details Panel */}
        {selectedFragment && (
          <div className="absolute bottom-6 left-1/2 w-full max-w-md -translate-x-1/2 rounded-2xl border border-white/20 bg-black/90 p-6 backdrop-blur-md z-30">
            <button
              onClick={() => setSelectedFragment(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="mb-1 text-xs text-gray-400">{selectedFragment.chain}</div>
                <h3 className="text-xl font-bold text-white">{selectedFragment.name}</h3>
                <div className="mt-2 inline-flex items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ background: fragmentColors[selectedFragment.fragment as keyof typeof fragmentColors] }}
                  >
                    Фрагмент {selectedFragment.fragment}
                  </span>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={{ background: rarityColors[selectedFragment.rarity as keyof typeof rarityColors] }}
                  >
                    {selectedFragment.rarity}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4 space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>
                  {selectedFragment.lat.toFixed(4)}, {selectedFragment.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>{selectedFragment.available ? "Доступно сейчас" : "Уже собрано"}</span>
              </div>
              <div className="mt-3 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                <div className="text-xs text-blue-300 mb-1">Требования для чекина:</div>
                <div className="text-xs text-gray-400">• Радиус: 5 метров</div>
                <div className="text-xs text-gray-400">• Удержание: 3 секунды</div>
              </div>
            </div>

            {selectedFragment.available ? (
              <Link href={`/checkin/${selectedFragment.id}`}>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500">
                  <Navigation className="mr-2 h-4 w-4" />
                  Начать чекин
                </Button>
              </Link>
            ) : (
              <Button disabled className="w-full" variant="secondary">
                Уже собрано
              </Button>
            )}
          </div>
        )}

        {/* Stats Overlay */}
        <div className="absolute right-6 top-6 rounded-xl border border-white/20 bg-black/80 p-4 backdrop-blur-md z-10">
          <div className="mb-2 text-xs text-gray-400">Доступно фрагментов</div>
          <div className="text-3xl font-bold text-white">
            {filteredFragments.filter((frag) => frag.available).length}
          </div>
          <div className="mt-1 text-xs text-gray-400">из {filteredFragments.length} в радиусе</div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 rounded-xl border border-white/20 bg-black/80 p-4 backdrop-blur-md z-10">
          <div className="mb-3 text-xs font-medium text-white">Тип фрагмента</div>
          <div className="space-y-2 mb-4">
            {Object.entries(fragmentColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ background: color }} />
                <span className="text-xs text-gray-300">Фрагмент {type}</span>
              </div>
            ))}
          </div>

          <div className="mb-3 text-xs font-medium text-white border-t border-white/10 pt-3">Редкость</div>
          <div className="space-y-2">
            {Object.entries(rarityColors).map(([rarity, color]) => (
              <div key={rarity} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ background: color }} />
                <span className="text-xs text-gray-300">{rarity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .leaflet-container {
          background: #1a1a1a;
          height: 100%;
          width: 100%;
        }
      `}</style>
    </div>
  )
}
