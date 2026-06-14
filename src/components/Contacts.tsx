const socials = [
  {
    name: 'Discord',
    description: 'Наш основной сервер — поддержка, покупки, общение',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
      </svg>
    ),
    link: 'https://discord.gg/',
    color: 'from-[#5865F2] to-[#4752c4]',
    bgColor: 'bg-[#5865F2]/10',
    borderColor: 'border-[#5865F2]/20',
  },
  {
    name: 'Telegram',
    description: 'Новости, обновления и анонсы продуктов',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    link: 'https://t.me/',
    color: 'from-[#229ED9] to-[#1a7fb5]',
    bgColor: 'bg-[#229ED9]/10',
    borderColor: 'border-[#229ED9]/20',
  },
  {
    name: 'FunPay',
    description: 'Наш магазин на FunPay — каталог и покупки',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
    link: 'https://funpay.com/',
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    name: 'YouTube',
    description: 'Обзоры продуктов и туториалы',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    link: 'https://youtube.com/',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
];

export default function Contacts() {
  return (
    <section id="contacts" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-brand/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand-light text-sm font-medium mb-4">
            Связь с нами
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Наши <span className="gradient-text">контакты</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Присоединяйтесь к нашему сообществу и будьте в курсе всех обновлений
          </p>
        </div>

        {/* Social cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl bg-surface-card border border-border p-6 card-hover text-center"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${social.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                {social.icon}
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold text-text-primary mb-2">{social.name}</h3>

              {/* Description */}
              <p className="text-text-secondary text-sm leading-relaxed">{social.description}</p>

              {/* Arrow */}
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-light opacity-0 group-hover:opacity-100 transition-opacity">
                Перейти
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-text-primary text-center mb-8">Частые вопросы</h3>
          <div className="space-y-4">
            {[
              {
                q: 'Как быстро я получу товар после оплаты?',
                a: 'На FunPay — моментально после оплаты. Через реселлеров — обычно в течение 10-30 минут. Кастомные заказы обсуждаются индивидуально.',
              },
              {
                q: 'Есть ли гарантия на продукты?',
                a: 'Да! Мы предоставляем полную поддержку и исправление багов бесплатно. На кастомные заказы — гарантия до 30 дней.',
              },
              {
                q: 'Можно ли заказать кастомный плагин/мод?',
                a: 'Конечно! Свяжитесь с нами в Discord, опишите вашу идею, и мы оценим сроки и стоимость разработки.',
              },
              {
                q: 'Какие способы оплаты вы принимаете?',
                a: 'На FunPay доступны все основные способы: банковские карты, QIWI, ЮMoney и другие. Через реселлеров — по договорённости.',
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl bg-surface-card border border-border overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer text-text-primary font-medium hover:text-brand-light transition-colors">
                  {faq.q}
                  <svg className="w-5 h-5 text-text-secondary shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-text-secondary text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
