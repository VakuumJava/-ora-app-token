import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { FadeIn } from "@/components/fade-in"

const steps = [
  {
    icon: "/icons/location-pin.png",
    title: "Найди на карте",
    description: "Открой карту на нашем сайте и найди ближайшие точки дропа NFT"
  },
  {
    icon: "/icons/sparkles.png",
    title: "Приди и забери",
    description: "Дойди до локации, остановись на 3 секунды, подожди чек-ин и получи уникальный NFT себе в коллекцию"
  },
  {
    icon: "/icons/trophy.png",
    title: "Собери и продай",
    description: "Собирай цепочки, апгрейдь карточки и торгуй на маркетплейсе"
  }
]

export function HowItWorks() {
  return (
    <section className="relative py-8 sm:py-12">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn delay={0} duration={0.3}>
          <h2 
            className="mb-8 sm:mb-12 text-center text-2xl sm:text-3xl font-bold text-white"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            Как это работает
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
          {steps.map((step, index) => (
            <FadeIn key={index} delay={0.05 + index * 0.05} duration={0.3}>
              <Card
                className="w-full max-w-[320px] min-h-[220px] sm:h-[240px] rounded-[24px] sm:rounded-[28px] border backdrop-blur-md hover:backdrop-blur-lg transition-all duration-300"
                style={{
                  background: "rgba(0, 68, 255, 0.08)",
                  borderColor: "rgba(0, 136, 255, 0.3)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                }}
              >
              <CardContent className="p-5 sm:p-6 pt-5 sm:pt-6 flex flex-col h-full">
                <div className="mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center backdrop-blur-sm">
                  <Image src={step.icon} alt={step.title} width={24} height={24} className="object-contain w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 
                  className="mb-2 sm:mb-3 text-base sm:text-lg font-bold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {step.title}
                </h3>
                <p 
                  className="text-sm leading-relaxed text-white/70"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {step.description}
                </p>
              </CardContent>
            </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
