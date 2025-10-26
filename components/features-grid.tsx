import { FadeIn } from "@/components/fade-in"

const features = [
  {
    number: "01",
    title: "Лёгкий старт без вложений:",
    description: "Чек-ин → 3 осколка → карточка → продажа на P2P.",
  },
  {
    number: "02",
    title: "Редкость = цена:",
    description: "Лимитированные выпуски, растущий спрос у коллекционеров.",
  },
  {
    number: "03",
    title: "Настоящая собственность:",
    description: "Карточка минтится в ваш кошелёк как NFT.",
  },
  {
    number: "04",
    title: "Чистые сделки:",
    description: "Продаёте и покупаете напрямую, сами ставите цену.",
  },
]

export function FeaturesGrid() {
  return (
    <section className="relative py-20">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FadeIn key={index} delay={0.2 + index * 0.1} duration={0.8}>
              <div 
                className="relative p-8 rounded-[32px] backdrop-blur-sm hover:border-[#7FA0E3]/30 transition-all duration-300 group"
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "2px solid #7FA0E3",
                }}
              >
                {/* Number Badge */}
                <div className="absolute top-6 right-6">
                  <span 
                    className="text-6xl font-bold transition-colors"
                    style={{ 
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: "rgba(127, 160, 227, 0.5)", // 7FA0E3 с 50% прозрачностью - тусклее
                    }}
                  >
                    {feature.number}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 
                    className="font-bold mb-4 pr-16 text-xl"
                    style={{ 
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: "#A3C4F3", // Чуть ярче чем 7FA0E3
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-base leading-relaxed"
                    style={{ 
                      fontFamily: "'Inter', sans-serif",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
