'use client'

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function InstructionPage() {
  const router = useRouter()

  const faqs = [
    {
      question: "Что такое Qora?",
      answer: "Qora — это инновационная платформа для коллекционирования NFT-карточек, связанных с реальными локациями. Собирайте фрагменты, создавайте полные карточки и торгуйте ими на маркетплейсе."
    },
    {
      question: "Как начать собирать карточки?",
      answer: "Зарегистрируйтесь на платформе, затем используйте карту для поиска локаций рядом с вами. Посетите эти места физически и выполните чек-ин, чтобы получить фрагменты карточек."
    },
    {
      question: "Что такое фрагменты?",
      answer: "Фрагменты — это части NFT-карточек. Каждая карточка состоит из нескольких фрагментов. Соберите все фрагменты одной карточки, чтобы получить полную NFT-карточку."
    },
    {
      question: "Как работает чек-ин?",
      answer: "Откройте раздел 'Карта', найдите активную локацию рядом с вами, подойдите к ней физически и нажмите кнопку чек-ина. Система проверит ваше местоположение и выдаст фрагмент."
    },
    {
      question: "Что делать с собранными карточками?",
      answer: "Вы можете хранить их в своей коллекции, торговать на маркетплейсе или обменивать с другими пользователями. Редкие карточки могут иметь высокую ценность!"
    },
    {
      question: "Как работает маркетплейс?",
      answer: "На маркетплейсе вы можете покупать и продавать карточки и фрагменты. Установите цену для своих предметов или купите то, что вам нужно для завершения коллекции."
    },
    {
      question: "Какие бывают категории редкости?",
      answer: "Карточки делятся на 5 категорий: Обычные, Необычные, Редкие, Эпические и Легендарные. Чем реже карточка, тем выше ее цена на рынке!"
    },
    {
      question: "Где посмотреть свои карточки?",
      answer: "Все ваши карточки и фрагменты находятся в разделах 'Инвентарь' и 'Коллекции'. Там вы можете управлять ими, просматривать статистику и отслеживать прогресс."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#030014] relative pt-24 pb-16 px-6">
      {/* Отблики для глубины */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#7FA0E3]/5 rounded-full blur-3xl" />
      <div className="absolute top-96 right-1/4 w-80 h-80 bg-[#A3C4F3]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-[#7FA0E3]/5 rounded-full blur-3xl" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Кнопка назад */}
        <button
          onClick={() => router.push('/')}
          className="mb-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm md:text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Назад
          </span>
        </button>

        {/* Заголовок */}
        <h1 
          className="text-5xl md:text-7xl font-bold text-white text-center mb-8"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Инструкция
        </h1>
        
        <p 
          className="text-xl md:text-2xl text-white/60 text-center mb-20"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Все что нужно знать для начала работы с платформой
        </p>

        {/* FAQ список */}
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10 hover:bg-white/8 hover:border-[#7FA0E3]/30 transition-all duration-300"
            >
              <h3 
                className="text-2xl md:text-4xl font-semibold text-[#A3C4F3] mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {index + 1}. {faq.question}
              </h3>
              <p 
                className="text-xl md:text-2xl text-white/80 leading-relaxed"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Нижний призыв к действию */}
        <div className="mt-20 text-center">
          <p 
            className="text-2xl md:text-3xl text-white/70 mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Готовы начать свое приключение?
          </p>
          <a 
            href="/register"
            className="inline-block px-12 py-5 bg-gradient-to-r from-[#7FA0E3] to-[#A3C4F3] text-white text-xl md:text-2xl font-semibold rounded-full hover:scale-105 transition-transform duration-300"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Зарегистрироваться
          </a>
        </div>
      </div>
    </div>
  );
}
