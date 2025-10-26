'use client'

import { useState, useEffect } from 'react'
import { SiteHeader } from '@/components/site-header'
import { useRouter } from 'next/navigation'
import { Calendar, Gem, CreditCard } from 'lucide-react'

interface UserStats {
  daysOnSite: number
  shardsFound: number
  cardsOwned: number
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/user/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else if (response.status === 401) {
          router.push('/login')
        } else {
          setError('Ошибка загрузки статистики')
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Ошибка загрузки статистики')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [router])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Atmospheric glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-32 right-1/4 w-96 h-96 bg-[#7FA0E3]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-20 w-80 h-80 bg-[#A3C4F3]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-[#7FA0E3]/5 rounded-full blur-[130px]" />
      </div>

      <SiteHeader />

      <div className="pt-32 pb-20 relative z-10 min-h-screen">
        <div className="mx-auto max-w-5xl px-6">
          <h1 
            className="text-5xl md:text-7xl font-bold text-white text-center mb-4"
            style={{ fontFamily: "'MuseoModerno', sans-serif" }}
          >
            Профиль
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/60 text-center mb-16"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Ваша статистика в мире Qora
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-3xl bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-400 text-xl">{error}</p>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Дней на сайте */}
              <div 
                className="relative group cursor-pointer rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 hover:bg-white/10 transition-all duration-300"
                style={{
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
                }}
              >
                <div className="mb-6">
                  <Calendar className="w-12 h-12 text-[#7FA0E3]" />
                </div>
                <div 
                  className="text-5xl font-bold text-white mb-3"
                  style={{ fontFamily: "'MuseoModerno', sans-serif" }}
                >
                  {stats.daysOnSite}
                </div>
                <div 
                  className="text-xl text-white/70"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {stats.daysOnSite === 1 ? 'день' : stats.daysOnSite < 5 ? 'дня' : 'дней'} на сайте
                </div>
              </div>

              {/* Осколков найдено */}
              <div 
                className="relative group cursor-pointer rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 hover:bg-white/10 transition-all duration-300"
                style={{
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
                }}
              >
                <div className="mb-6">
                  <Gem className="w-12 h-12 text-[#A3C4F3]" />
                </div>
                <div 
                  className="text-5xl font-bold text-white mb-3"
                  style={{ fontFamily: "'MuseoModerno', sans-serif" }}
                >
                  {stats.shardsFound}
                </div>
                <div 
                  className="text-xl text-white/70"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {stats.shardsFound === 1 ? 'осколок' : stats.shardsFound < 5 ? 'осколка' : 'осколков'} найдено
                </div>
              </div>

              {/* Карточек собрано */}
              <div 
                className="relative group cursor-pointer rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 hover:bg-white/10 transition-all duration-300"
                style={{
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
                }}
              >
                <div className="mb-6">
                  <CreditCard className="w-12 h-12 text-[#7FA0E3]" />
                </div>
                <div 
                  className="text-5xl font-bold text-white mb-3"
                  style={{ fontFamily: "'MuseoModerno', sans-serif" }}
                >
                  {stats.cardsOwned}
                </div>
                <div 
                  className="text-xl text-white/70"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {stats.cardsOwned === 1 ? 'карточка' : stats.cardsOwned < 5 ? 'карточки' : 'карточек'} собрано
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
