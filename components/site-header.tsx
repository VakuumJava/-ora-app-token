'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Wallet } from "lucide-react"
import { WalletConnectModal } from "./wallet-connect-modal"

interface User {
  id: string
  email: string
  nickname: string
  avatarUrl?: string
}

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
    <header className={`fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-xl bg-black/30 border-b border-white/10 transition-all duration-300 ${
      isScrolled ? 'bg-black/50' : 'bg-black/30'
    }`}>
      <div className={`mx-auto flex max-w-[1920px] items-center justify-between px-6 md:px-12 transition-all duration-300 ${
        isScrolled ? 'h-16' : 'h-20'
      }`}>
        <Link href="/" className={`flex items-center gap-3 hover:opacity-80 transition-all duration-300 ${
          isScrolled ? 'scale-90' : 'scale-100'
        }`}>
          <div className={`relative transition-all duration-300 ${
            isScrolled ? 'w-[30px] h-[35px]' : 'w-[37px] h-[43px]'
          }`}>
            <Image src="/Logo.svg" alt="Qora" width={37} height={43} className="object-contain" />
          </div>
          <span
            className={`text-white font-normal transition-all duration-300 ${
              isScrolled ? 'text-[28px] md:text-[32px]' : 'text-[32px] md:text-[40px]'
            }`}
            style={{ fontFamily: "'MuseoModerno', sans-serif" }}
          >
            qora
          </span>
        </Link>

        <nav className="hidden lg:flex items-center justify-center gap-8">
          <Link 
            href="/collections" 
            className="text-sm text-white/80 transition-all hover:text-white font-medium"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Коллекции
          </Link>
          <Link 
            href="/marketplace" 
            className="text-sm text-white/80 transition-all hover:text-white font-medium"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Маркетплейс
          </Link>
          <Link 
            href="/map" 
            className="text-sm text-white/80 transition-all hover:text-white font-medium"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Карта
          </Link>
          <Link 
            href="/inventory" 
            className="text-sm text-white/80 transition-all hover:text-white font-medium"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Инвентарь
          </Link>
          <Link 
            href="/instruction" 
            className="text-sm text-white/80 transition-all hover:text-white font-medium"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Инструкция
          </Link>
          <Link 
            href="/profile" 
            className="text-sm text-white/80 transition-all hover:text-white font-medium"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Профиль
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-3">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse bg-white/10 rounded-full" />
          ) : user ? (
            <>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 rounded-full px-5 text-sm text-white/90 hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  @{user.nickname}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWalletModalOpen(true)}
                className="h-9 rounded-full border-white/20 bg-white/5 backdrop-blur-md px-5 text-sm text-white hover:bg-[#7FA0E3]/20 hover:border-[#7FA0E3]/40 transition-all flex items-center gap-2"
                style={{ 
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.2)"
                }}
              >
                <Wallet className="w-4 h-4" />
                Кошелек
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-9 rounded-full border-white/20 bg-white/5 backdrop-blur-md px-5 text-sm text-white/80 hover:bg-red-500/20 hover:border-red-500/40 hover:text-white transition-all"
                style={{ 
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.2)"
                }}
              >
                Выход
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 rounded-full px-5 text-sm text-white/80 hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Вход
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-full border-white/20 bg-white/5 backdrop-blur-md px-5 text-sm text-white hover:bg-white/15 hover:border-white/40 transition-all"
                  style={{ 
                    fontFamily: "'Space Grotesk', sans-serif",
                    boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.2)"
                  }}
                >
                  Регистрация
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>

    <WalletConnectModal 
      isOpen={isWalletModalOpen} 
      onClose={() => setIsWalletModalOpen(false)} 
    />
    </>
  )
}
