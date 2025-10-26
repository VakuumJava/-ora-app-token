'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { User, LogOut, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { WalletConnectModal } from "@/components/wallet-connect-modal"

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<{ nickname: string; email: string } | null>(null)
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
    // Проверяем авторизацию
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Auth check error:', error)
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
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-xl bg-black/30 border-b border-white/10 transition-all duration-300 ${
      isScrolled ? 'bg-black/50' : 'bg-black/30'
    }`}>
      <div className={`mx-auto flex max-w-[1920px] items-center justify-between px-6 md:px-12 transition-all duration-300 ${
        isScrolled ? 'h-16' : 'h-20'
      }`}>
        {/* Logo */}
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

        {/* Navigation */}
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
            href="/profile" 
            className="text-sm text-white/80 transition-all hover:text-white font-medium"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Профиль
          </Link>
        </nav>

        {/* Auth buttons / User profile */}
        <div className="flex items-center justify-end gap-3">
          {isLoading ? (
            <div className="w-24 h-10 rounded-full backdrop-blur-lg bg-white/5 animate-pulse" />
          ) : user ? (
            <>
              {/* Wallet Connect button */}
              <button 
                onClick={() => setIsWalletModalOpen(true)} 
                className="group"
              >
                <div 
                  className="flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-lg transition-all duration-500 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    boxShadow: "0 4px 16px rgba(59, 130, 246, 0.2)",
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 100%)",
                    }}
                  />
                  <Wallet className="w-4 h-4 text-blue-400 relative z-10" />
                  <span 
                    className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors duration-500 font-medium relative z-10"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Кошелек
                  </span>
                </div>
              </button>

              {/* User profile button - красная кнопка с иконкой */}
              <Link href="/profile" className="group">
                <div 
                  className="flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-lg transition-all duration-500 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    boxShadow: "0 4px 16px rgba(239, 68, 68, 0.2)",
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%)",
                    }}
                  />
                  <User className="w-4 h-4 text-red-400 relative z-10" />
                  <span 
                    className="text-sm text-red-400 group-hover:text-red-300 transition-colors duration-500 font-medium relative z-10"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {user.nickname}
                  </span>
                </div>
              </Link>
              
              {/* Logout button */}
              <button onClick={handleLogout} className="group">
                <div 
                  className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-lg transition-all duration-500 relative overflow-hidden"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <LogOut className="w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-300 relative z-10" />
                </div>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="group">
                <div 
                  className="flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-lg transition-all duration-500 relative overflow-hidden"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(135deg, rgba(147, 51, 234, 0.3) 0%, rgba(168, 85, 247, 0.2) 100%)",
                    }}
                  />
                  <span 
                    className="text-sm text-white/70 group-hover:text-white transition-colors duration-500 font-medium relative z-10"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Вход
                  </span>
                </div>
              </Link>
              <Link href="/register" className="group">
                <div 
                  className="flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-lg transition-all duration-500 relative overflow-hidden"
                  style={{
                    background: "rgba(255, 255, 255, 0.12)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 100%)",
                    }}
                  />
                  <span 
                    className="text-sm text-white/90 group-hover:text-white transition-colors duration-500 font-medium relative z-10"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Регистрация
                  </span>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Wallet Connect Modal */}
      <WalletConnectModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />
    </header>
  )
}
