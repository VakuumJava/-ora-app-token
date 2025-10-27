import { FadeIn } from "@/components/fade-in"

const infoColumns = [
  {
    title: "Категория",
    items: [
      "Игровая механика",
      "Геймифика",
      "Карточная коллекция",
      "Коллекционирование",
      "Виртуальные бонусы",
      "Торговля NFT"
    ]
  },
  {
    title: "Преимущество",
    items: [
      "Поощ за исследование",
      "Уникальные серии",
      "Маркетплейс с редкими и частыми NF",
      "Симво места",
      "Эффективность",
      "Управление"
    ]
  },
  {
    title: "Описание",
    descriptions: [
      "Пользователи посещают места, выполняют действия и получают карточки со связь с геолокацией.",
      "Каждая карта уникальна и отража определённую локацию бренд.",
      "Возможность свободно торговать редкими и обыч NFT, создавая свой рынок.",
      "Визуально привлекательные карто отражают культурное значение местности и привл к локациям.",
      "Проект обеспеч мотивацию для офлайн активности, упр локациями и коллекциями в од приложении."
    ]
  }
]

export function InfoSection() {
  return (
    <section className="relative py-8 sm:py-12 md:py-16 border-t border-white/10">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mt-6 sm:mt-8">
          {infoColumns.map((column, index) => (
            <FadeIn key={index} delay={0.05 + index * 0.05} duration={0.3}>
              <div>
                <h3 
                  className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-6"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {column.title}
                </h3>
                {column.items ? (
                  <ul className="space-y-3 sm:space-y-4 text-white/70 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {column.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-3 sm:space-y-4 text-white/70 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {column.descriptions?.map((desc, i) => (
                      <p key={i}>{desc}</p>
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
