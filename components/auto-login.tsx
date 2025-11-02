'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Компонент автологина
 * Автоматически восстанавливает сессию пользователя при перезагрузке страницы
 */
export function AutoLogin() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Проверяем только на клиенте
    if (typeof window === 'undefined') return

    // Не проверяем на страницах логина/регистрации
    const publicPages = ['/login', '/register', '/auth/callback', '/auth/check-email']
    if (publicPages.some(page => pathname.startsWith(page))) {
      return
    }

    // Проверяем наличие сохранённого userId
    const savedUserId = localStorage.getItem('qora_autologin_userId')
    const savedUsername = localStorage.getItem('qora_autologin_username')

    if (savedUserId && savedUsername) {
      
      
      // Проверяем валидность сессии на сервере
      fetch('/api/auth/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: savedUserId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            
            // Сессия валидна, ничего не делаем
          } else {
            
            localStorage.removeItem('qora_autologin_userId')
            localStorage.removeItem('qora_autologin_username')
            
            // Перенаправляем только если не на публичных страницах
            if (pathname !== '/' && !pathname.startsWith('/instruction')) {
              router.push('/login')
            }
          }
        })
        .catch(err => {
          console.error('Ошибка проверки сессии:', err)
        })
    } else {
      
      
      // Если пользователь пытается зайти на защищённые страницы без логина
      const protectedPages = ['/inventory', '/profile', '/admin', '/marketplace']
      if (protectedPages.some(page => pathname.startsWith(page))) {
        
        router.push('/login')
      }
    }
  }, [pathname, router])

  return null // Этот компонент ничего не рендерит
}
