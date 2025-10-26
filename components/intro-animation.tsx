'use client'

import { useState, useEffect } from 'react'

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [text, setText] = useState('')
  const [isDissolving, setIsDissolving] = useState(false)
  const fullText = 'Простая игра...\nНо цифровизация всего мира'
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Небольшая задержка перед началом анимации для полной загрузки
    const readyTimer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(readyTimer)
  }, [])

  useEffect(() => {
    if (!isReady) return

    let currentIndex = 0
    const typingSpeed = 80 // миллисекунды на символ

    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(fullText.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typeInterval)
        // Начинаем растворение через 1 секунду после окончания печати
        setTimeout(() => {
          setIsDissolving(true)
          // Завершаем анимацию через 1.5 секунды после начала растворения
          setTimeout(onComplete, 1500)
        }, 1000)
      }
    }, typingSpeed)

    return () => clearInterval(typeInterval)
  }, [fullText, onComplete, isReady])

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden">
      {/* Звезды на фоне - появляются при растворении */}
      {isDissolving && (
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* Текст */}
      <div className="relative z-10 px-8">
        <h1
          className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center whitespace-pre-line transition-all duration-1000 ${
            isDissolving ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100 blur-0'
          }`}
          style={{
            fontFamily: "'MuseoModerno', sans-serif",
            textShadow: isDissolving
              ? '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.5)'
              : '0 0 20px rgba(255,255,255,0.3)',
          }}
        >
          {text}
          <span className="animate-pulse">|</span>
        </h1>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
