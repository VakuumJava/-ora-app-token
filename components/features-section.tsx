"use client"

import { FadeIn } from "@/components/fade-in"
import { useState, useEffect } from "react"
import { ArrowUp, LifeBuoy } from "lucide-react"

export function FeaturesSection() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const features = [
    {
      number: "01",
      title: "Лёгкий старт без вложений:",
      description: "Чек-ин → 3 осколка → карточка → продажа на P2P.",
      hasSpecialBorder: true
    },
    {
      number: "02",
      title: "Редкость = цена:",
      description: "Лимитированные выпуски, растущий спрос у коллекционеров.",
      hasSpecialBorder: false
    },
    {
      number: "03",
      title: "Настоящая собственность:",
      description: "Карточка минтится в ваш кошелёк как NFT.",
      hasSpecialBorder: false
    },
    {
      number: "04",
      title: "Чистые сделки:",
      description: "Продаёте и покупаете напрямую, сами ставите цену.",
      hasSpecialBorder: false
    }
  ]

  return (
    <section className="relative container mx-auto px-6 py-20 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <FadeIn key={index} delay={0.2 + index * 0.1} duration={0.8}>
            <div 
              className="relative group h-full"
              style={{
                padding: "2px",
                background: feature.hasSpecialBorder 
                  ? "linear-gradient(135deg, rgba(127, 160, 227, 0.6) 0%, rgba(127, 160, 227, 0.2) 50%, rgba(127, 160, 227, 0.05) 100%)"
                  : "rgba(255, 255, 255, 0.15)",
                borderRadius: "28px",
              }}
            >
              <div 
                className="relative h-full p-8 rounded-[26px] transition-all duration-500 group-hover:border-white/10"
                style={{
                  background: "rgba(15, 15, 35, 0.7)",
                  backdropFilter: "blur(30px)",
                  border: "1.5px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15),
                    inset 0 -1px 0 rgba(255, 255, 255, 0.05)
                  `,
                }}
              >
                {/* Номер */}
                <div 
                  className="absolute top-6 right-8 text-[80px] leading-none font-bold"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "rgba(127, 160, 227, 0.2)",
                  }}
                >
                  {feature.number}
                </div>

                {/* Контент */}
                <div className="relative z-10 pt-4">
                  <h3 
                    className="text-[20px] leading-tight font-semibold mb-10 pr-16"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: "rgba(140, 177, 251, 0.9)",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-white/80 text-[15px] leading-relaxed"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Кнопка скролла вверх */}
      <div className="flex justify-center mt-12">
        <button
          onClick={scrollToTop}
          className={`glass-button-combined transition-all duration-500 ${
            showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="glass-icon-circle">
            <svg width="28" height="28" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32.5" cy="32.5" r="14.125" stroke="#2A303B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M42.25 22.75L36.5219 28.4781M36.5219 28.4781C38.7124 30.6702 38.7124 34.3314 36.5219 36.5219M36.5219 28.4781C34.3314 26.2876 30.6702 26.2876 28.4781 28.4781M22.75 42.25L28.4781 36.5219M28.4781 36.5219C26.2876 34.3314 26.2876 30.6702 28.4781 28.4781M28.4781 36.5219C30.6686 38.7124 34.3298 38.7124 36.5219 36.5219M22.75 22.75L28.4781 28.4781M42.25 42.25L36.5219 36.5219" stroke="#2A303B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="glass-text-section">
            <ArrowUp className="w-3.5 h-3.5 text-white/90 mr-1.5" strokeWidth={2.5} />
            <span className="text-white/90 text-[13px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              Наверх
            </span>
          </div>
        </button>
      </div>

      <style jsx>{`
        .glass-button-combined {
          display: flex;
          align-items: center;
          background: rgba(35, 43, 68, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 100px;
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(255, 255, 255, 0.02);
          position: relative;
          overflow: visible;
          cursor: pointer;
          padding: 3px;
          padding-right: 16px;
        }

        .glass-button-combined:hover {
          background: rgba(45, 53, 78, 0.6);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
          box-shadow: 
            0 6px 24px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03);
        }

        .glass-button-combined::before {
          content: '';
          position: absolute;
          top: 0;
          left: 48px;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0.05),
            transparent
          );
        }

        .glass-icon-circle {
          width: 48px;
          height: 48px;
          background: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 
            0 2px 12px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .glass-text-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0 0 12px;
          min-width: 100px;
        }
      `}</style>
    </section>
  )
}
