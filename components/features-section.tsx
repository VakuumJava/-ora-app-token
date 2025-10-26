"use client"

import { FadeIn } from "@/components/fade-in"
import { LifeBuoy } from "lucide-react"

export function FeaturesSection() {
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
