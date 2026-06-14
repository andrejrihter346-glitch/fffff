import { useState } from 'react';

const paymentMethods = [
  {
    id: 'funpay',
    name: 'FunPay',
    icon: '🛒',
    popular: true,
    description: 'Самый популярный способ покупки наших продуктов. Безопасные сделки с гарантией платформы.',
    steps: [
      'Перейдите на нашу страницу FunPay',
      'Выберите нужный продукт из каталога',
      'Оплатите удобным для вас способом',
      'Получите товар моментально после оплаты',
    ],
    pros: ['Гарантия сделки', 'Множество способов оплаты', 'Отзывы и рейтинг', 'Автоматическая выдача'],
    link: 'https://funpay.com/',
    linkText: 'Перейти на FunPay',
    accentColor: 'from-purple-500 to-indigo-600',
    bgAccent: 'bg-purple-500/10',
    borderAccent: 'border-purple-500/30',
  },
  {
    id: 'resellers',
    name: 'Реселлеры',
    icon: '🤝',
    popular: false,
    description: 'Покупка через наших официальных реселлеров в Discord сервере. Личное общение и индивидуальный подход.',
    steps: [
      'Зайдите на наш Discord сервер',
      'Найдите канал #реселлеры или #магазин',
      'Выберите реселлера с ролью «Реселлер»',
      'Договоритесь об оплате и получите товар',
    ],
    pros: ['Личное общение', 'Гибкие цены', 'Скидки постоянным клиентам', 'Консультация по выбору'],
    link: 'https://discord.gg/',
    linkText: 'Зайти в Discord',
    accentColor: 'from-cyan-500 to-blue-600',
    bgAccent: 'bg-cyan-500/10',
    borderAccent: 'border-cyan-500/30',
  },
  {
    id: 'direct',
    name: 'Напрямую',
    icon: '💬',
    popular: false,
    description: 'Для кастомных заказов и крупных проектов. Свяжитесь с нами напрямую для обсуждения условий.',
    steps: [
      'Напишите в ЛС администратору в Discord',
      'Опишите ваш проект или требования',
      'Получите оценку сроков и стоимости',
      'Согласуйте условия и начните работу',
    ],
    pros: ['Кастомные проекты', 'Индивидуальные цены', 'Этапная оплата', 'Полная поддержка'],
    link: 'https://discord.gg/',
    linkText: 'Написать в Discord',
    accentColor: 'from-emerald-500 to-teal-600',
    bgAccent: 'bg-emerald-500/10',
    borderAccent: 'border-emerald-500/30',
  },
];

export default function Payment() {
  const [activeTab, setActiveTab] = useState('funpay');
  const activeMethod = paymentMethods.find((m) => m.id === activeTab)!;

  return (
    <section id="payment" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand-light text-sm font-medium mb-4">
            Оплата
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Способы <span className="gradient-text">оплаты</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Выберите удобный для вас способ приобретения наших продуктов
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setActiveTab(method.id)}
              className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                activeTab === method.id
                  ? 'bg-surface-card border border-brand/30 text-text-primary shadow-lg shadow-brand/10'
                  : 'bg-surface-card/50 border border-border text-text-secondary hover:text-text-primary hover:border-border'
              }`}
            >
              <span className="text-lg">{method.icon}</span>
              {method.name}
              {method.popular && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500/90 text-[10px] font-bold text-black">
                  ХИТ
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className="animate-fade-in-up" key={activeTab}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Info */}
            <div className="rounded-2xl bg-surface-card border border-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{activeMethod.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">{activeMethod.name}</h3>
                  {activeMethod.popular && (
                    <span className="text-xs font-medium text-amber-400">Рекомендуемый способ</span>
                  )}
                </div>
              </div>

              <p className="text-text-secondary leading-relaxed mb-8">{activeMethod.description}</p>

              {/* Pros */}
              <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Преимущества</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {activeMethod.pros.map((pro) => (
                  <div key={pro} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${activeMethod.accentColor} flex items-center justify-center shrink-0`}>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-text-secondary">{pro}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href={activeMethod.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${activeMethod.accentColor} text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity`}
              >
                {activeMethod.linkText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Right: Steps */}
            <div className="rounded-2xl bg-surface-card border border-border p-8">
              <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-6">Как купить</h4>

              <div className="space-y-6">
                {activeMethod.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    {/* Step number */}
                    <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${activeMethod.accentColor} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {index + 1}
                    </div>
                    {/* Step content */}
                    <div className="pt-2">
                      <p className="text-text-primary font-medium">{step}</p>
                      {index < activeMethod.steps.length - 1 && (
                        <div className="w-0.5 h-6 bg-border ml-4 mt-3" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Info box */}
              <div className={`mt-8 p-4 rounded-xl ${activeMethod.bgAccent} border ${activeMethod.borderAccent}`}>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-light shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    При возникновении проблем с оплатой или получением товара — обращайтесь в наш Discord сервер для оперативной помощи.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
