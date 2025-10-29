'use client'

import { useState, useEffect } from 'react'
import { SiteHeader } from '@/components/site-header'
import { useRouter } from 'next/navigation'
import { Calendar, Gem, CreditCard, User, Trash2, Mail, UserCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getUserSession } from '@/lib/user-session'

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем текущего пользователя из сессии
        const session = getUserSession()
        console.log('👤 Профиль пользователя:', session.userId)

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

        // Получаем статистику с userId
        const statsResponse = await fetch(`/api/user/stats?userId=${session.userId}`)
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
          console.log('📊 Статистика загружена:', statsData)
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

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
      })

      if (response.ok) {
        // Выход и перенаправление
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login?deleted=true')
      } else {
        const data = await response.json()
        setError(data.error || 'Ошибка удаления аккаунта')
      }
    } catch (err) {
      setError('Ошибка при удалении аккаунта')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Минимальные градиенты на фоне */}
      <div className="fixed inset-0 pointer-events-none opacity-20 sm:opacity-30">
        <div className="absolute top-1/4 -right-32 sm:-right-48 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/20 rounded-full blur-[100px] sm:blur-[140px]" />
        <div className="absolute bottom-1/4 -left-32 sm:-left-48 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/20 rounded-full blur-[100px] sm:blur-[140px]" />
      </div>

      <SiteHeader />

      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 relative z-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          {isLoading ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Skeleton для профиля */}
              <div className="h-24 sm:h-32 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 animate-pulse" />
              {/* Skeleton для статистики */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 sm:h-40 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl backdrop-blur-xl bg-red-500/10 border border-red-500/20 p-4 sm:p-6">
              <p className="text-red-400 text-center text-sm sm:text-base">{error}</p>
            </div>
          ) : (
            <>
                            {/* Карточка профиля - минималистичная */}
              {user && (
                <div className="mb-4 sm:mb-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-5 sm:p-6 md:p-8 transition-all hover:bg-white/[0.07]">
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
                    {/* Аватар */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-white/70" />
                    </div>
                    
                    {/* Информация */}
                    <div className="flex-1 text-center sm:text-left">
                      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 break-words">
                        {user.nickname}
                      </h1>
                      <p className="text-white/50 text-xs sm:text-sm break-all">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Статистика - минимальные карточки */}
              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {/* Дней на сайте */}
                  <div className="group rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4 sm:p-5 md:p-6 transition-all hover:bg-white/[0.07] hover:border-white/20">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                      {stats.daysOnSite}
                    </div>
                    <div className="text-xs sm:text-sm text-white/50">
                      {stats.daysOnSite === 1 ? 'день' : stats.daysOnSite < 5 ? 'дня' : 'дней'} на сайте
                    </div>
                  </div>

                  {/* Осколков найдено */}
                  <div className="group rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4 sm:p-5 md:p-6 transition-all hover:bg-white/[0.07] hover:border-white/20">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Gem className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                      {stats.shardsFound}
                    </div>
                    <div className="text-xs sm:text-sm text-white/50">
                      {stats.shardsFound === 1 ? 'осколок' : stats.shardsFound < 5 ? 'осколка' : 'осколков'} найдено
                    </div>
                  </div>

                  {/* Карточек собрано */}
                  <div className="group rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4 sm:p-5 md:p-6 transition-all hover:bg-white/[0.07] hover:border-white/20">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                      {stats.cardsOwned}
                    </div>
                    <div className="text-xs sm:text-sm text-white/50">
                      {stats.cardsOwned === 1 ? 'карточка' : stats.cardsOwned < 5 ? 'карточки' : 'карточек'} собрано
                    </div>
                  </div>
                </div>
              )}

              {/* Настройки аккаунта */}
              <div className="mt-6 sm:mt-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4 sm:p-5 md:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Настройки аккаунта</h2>
                
                <div className="space-y-3 sm:space-y-4">
                  {/* Смена nickname */}
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 sm:gap-3 h-12 sm:h-14 bg-white/5 hover:bg-white/10 border-white/10 text-white text-sm sm:text-base"
                    onClick={() => router.push('/profile/change-nickname')}
                  >
                    <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="truncate">Изменить никнейм</span>
                  </Button>

                  {/* Смена email */}
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 sm:gap-3 h-12 sm:h-14 bg-white/5 hover:bg-white/10 border-white/10 text-white text-sm sm:text-base"
                    onClick={() => router.push('/profile/change-email')}
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="truncate">Изменить email</span>
                  </Button>

                  {/* Удалить аккаунт */}
                  {!showDeleteConfirm ? (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 sm:gap-3 h-12 sm:h-14 bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400 hover:text-red-300 text-sm sm:text-base"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="truncate">Удалить аккаунт</span>
                    </Button>
                  ) : (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 sm:p-4">
                      <Alert className="bg-transparent border-0 p-0 mb-3 sm:mb-4">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0" />
                        <AlertDescription className="text-red-300 text-xs sm:text-sm ml-2">
                          <strong>Внимание!</strong> После удаления аккаунта ваш nickname и email будут освобождены и доступны для регистрации.
                          Все ваши данные будут безвозвратно удалены.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex gap-2 sm:gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 bg-white/5 hover:bg-white/10 border-white/20 text-white text-sm h-10 sm:h-auto"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isDeleting}
                        >
                          Отмена
                        </Button>
                        <Button
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Удаление...' : 'Удалить навсегда'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
