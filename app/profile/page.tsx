'use client'

import { useState, useEffect } from 'react'
import { SiteHeader } from '@/components/site-header'
import { useRouter } from 'next/navigation'
import { Calendar, Gem, CreditCard, User } from 'lucide-react'

interface UserStats {
  daysOnSite: number
  shardsFound: number
  cardsOwned: number
}

interface UserData {
  nickname: string
  email: string
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем данные пользователя
        const userResponse = await fetch('/api/auth/me')
        if (userResponse.status === 401) {
          router.push('/login')
          return
        }
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData.user)
        }

        // Получаем статистику
        const statsResponse = await fetch('/api/user/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        } else {
          setError('Ошибка загрузки статистики')
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Ошибка загрузки данных')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Минимальные градиенты на фоне */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-purple-500/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-blue-500/20 rounded-full blur-[140px]" />
      </div>

      <SiteHeader />

      <div className="pt-32 pb-20 relative z-10 px-6">
        <div className="max-w-4xl mx-auto">
          
          {isLoading ? (
            <div className="space-y-6">
              {/* Skeleton для профиля */}
              <div className="h-32 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 animate-pulse" />
              {/* Skeleton для статистики */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-40 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl backdrop-blur-xl bg-red-500/10 border border-red-500/20 p-6">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          ) : (
            <>
              {/* Карточка профиля - минималистичная */}
              {user && (
                <div className="mb-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 transition-all hover:bg-white/[0.07]">
                  <div className="flex items-center gap-6">
                    {/* Аватар */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                      <User className="w-10 h-10 text-white/70" />
                    </div>
                    
                    {/* Информация */}
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-white mb-1">
                        {user.nickname}
                      </h1>
                      <p className="text-white/50 text-sm">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Статистика - минимальные карточки */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Дней на сайте */}
                  <div className="group rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 transition-all hover:bg-white/[0.07] hover:border-white/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {stats.daysOnSite}
                    </div>
                    <div className="text-sm text-white/50">
                      {stats.daysOnSite === 1 ? 'день' : stats.daysOnSite < 5 ? 'дня' : 'дней'} на сайте
                    </div>
                  </div>

                  {/* Осколков найдено */}
                  <div className="group rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 transition-all hover:bg-white/[0.07] hover:border-white/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Gem className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {stats.shardsFound}
                    </div>
                    <div className="text-sm text-white/50">
                      {stats.shardsFound === 1 ? 'осколок' : stats.shardsFound < 5 ? 'осколка' : 'осколков'} найдено
                    </div>
                  </div>

                  {/* Карточек собрано */}
                  <div className="group rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 transition-all hover:bg-white/[0.07] hover:border-white/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-cyan-400" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {stats.cardsOwned}
                    </div>
                    <div className="text-sm text-white/50">
                      {stats.cardsOwned === 1 ? 'карточка' : stats.cardsOwned < 5 ? 'карточки' : 'карточек'} собрано
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
