const reviews = [
  {
    name: 'moongeque',
    category: 'Minecraft',
    price: '200 ₽',
    text: 'Лучший чувак, все настроил и сделал. Главное что быстро. +помог с плагином, который в оплату не входил, все четко короче',
    rating: 5,
    date: '4 июня',
    timeAgo: 'неделю назад',
    product: '🛠️ Услуги Тех.Админа Minecraft',
  },
  {
    name: 'Matvey25z',
    category: 'Discord',
    price: '100 ₽',
    text: 'Лучший продавец всё объяснил!',
    rating: 5,
    date: '4 марта',
    timeAgo: '3 месяца назад',
    product: '🤖 Discord бот ◈ Модерация',
  },
  {
    name: 'Jajsjsznxp',
    category: 'Minecraft',
    price: '500 ₽',
    text: 'Все классно быстро четко советую, если что-то произойдет изменю, а так все отлично советую бомба пушка петарда',
    rating: 5,
    date: '7 февраля',
    timeAgo: '4 месяца назад',
    product: 'Кастомный заказ',
  },
  {
    name: 'Niko090',
    category: 'Steam',
    price: '200 ₽',
    text: 'Вообще супер, сразу ответил и даже скидку сделал',
    rating: 5,
    date: '22 февраля',
    timeAgo: '4 месяца назад',
    product: 'Услуги',
  },
  {
    name: 'Vovan4ikim',
    category: 'Minecraft',
    price: '800 ₽',
    text: 'Все быстро дёшево. Топ, 2 раз покупаю!',
    rating: 5,
    date: '3 января',
    timeAgo: '5 месяцев назад',
    product: 'БАРОН PlayMine',
  },
  {
    name: 'Ddaanniill999',
    category: 'Minecraft',
    price: '80 ₽',
    text: 'Ахуенные конфиги',
    rating: 5,
    date: '24 февраля',
    timeAgo: '4 месяца назад',
    product: 'Конфиги',
  },
  {
    name: 'login675242',
    category: 'Minecraft',
    price: '200 ₽',
    text: 'имба',
    rating: 5,
    date: '28 мая',
    timeAgo: '2 недели назад',
    product: '✔ Everlast для Meta HVH',
  },
  {
    name: 'zroclav372',
    category: 'Minecraft',
    price: '70 ₽',
    text: 'Imba',
    rating: 5,
    date: '31 марта',
    timeAgo: '2 месяца назад',
    product: '⚡ Wexside【Spooky Duels】',
  },
  {
    name: 'Manterse',
    category: 'Minecraft',
    price: '30 ₽',
    text: 'всем советую',
    rating: 5,
    date: '21 декабря',
    timeAgo: '6 месяцев назад',
    product: '👻 Everlast для Spooky Time',
  },
  {
    name: 'pon1701',
    category: 'Minecraft',
    price: '20 ₽',
    text: 'Все просто имбуличка)',
    rating: 5,
    date: '24 апреля',
    timeAgo: 'год назад',
    product: 'Конфиг Nursultan | FunSkyHvH',
  },
  {
    name: 'Byllkamakomm',
    category: 'Minecraft',
    price: '10 ₽',
    text: 'крут',
    rating: 5,
    date: '24 апреля',
    timeAgo: 'год назад',
    product: 'Конфиги',
  },
  {
    name: 'Pubgoftoper2',
    category: 'Minecraft',
    price: '20 ₽',
    text: 'Лучший просто',
    rating: 5,
    date: '5 апреля',
    timeAgo: 'год назад',
    product: 'Конфиги',
  },
  {
    name: 'SakyraJJ',
    category: 'Minecraft',
    price: '10 ₽',
    text: 'ЛУЧШИЙ',
    rating: 5,
    date: '23 декабря',
    timeAgo: '6 месяцев назад',
    product: 'Grim Anti Cheat Config',
  },
  {
    name: 'Playe2232',
    category: 'Minecraft',
    price: '90 ₽',
    text: 'хороший кфг топ',
    rating: 5,
    date: '24 февраля',
    timeAgo: '4 месяца назад',
    product: 'Конфиги',
  },
  {
    name: 'DSCOM',
    category: 'Minecraft',
    price: '10 ₽',
    text: 'Лучший',
    rating: 5,
    date: '30 декабря',
    timeAgo: '6 месяцев назад',
    product: 'Плагин MoonCases',
  },
];

const categoryColors: Record<string, string> = {
  'Minecraft': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Discord': 'bg-[#5865F2]/10 text-[#7289da] border-[#5865F2]/20',
  'Steam': 'bg-[#1b2838]/30 text-[#66c0f4] border-[#66c0f4]/20',
};

export default function Reviews() {
  return (
    <section className="relative py-24 md:py-32 bg-surface-light/50 overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
            Отзывы с FunPay
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Что говорят <span className="gradient-text">клиенты</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Реальные отзывы от наших покупателей
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-surface-card border border-border">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div>
              <div className="text-xl font-bold text-text-primary">5 из 5</div>
              <div className="text-xs text-text-secondary">Рейтинг продавца</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-surface-card border border-border">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold text-lg">
              31
            </div>
            <div>
              <div className="text-xl font-bold text-text-primary">Отзывов</div>
              <div className="text-xs text-text-secondary">за последний год</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-surface-card border border-border">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
              ✓
            </div>
            <div>
              <div className="text-xl font-bold text-text-primary">100%</div>
              <div className="text-xs text-text-secondary">положительных</div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reviews.map((review, index) => (
            <div
              key={`${review.name}-${index}`}
              className="rounded-2xl bg-surface-card border border-border p-5 card-hover"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-3.5 h-3.5 text-amber-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${categoryColors[review.category] || categoryColors['Minecraft']}`}>
                  {review.category}
                </span>
              </div>

              {/* Review text */}
              <p className="text-text-secondary text-sm leading-relaxed mb-3">"{review.text}"</p>

              {/* Product & Price */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="px-2 py-0.5 rounded-md bg-brand/10 text-brand-light text-[10px] font-medium border border-brand/20">
                  {review.product}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-medium border border-amber-500/20">
                  {review.price}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand/20 to-accent/20 flex items-center justify-center text-xs font-bold text-brand-light">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-text-primary">{review.name}</span>
                </div>
                <span className="text-[10px] text-text-secondary">{review.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>

        {/* FunPay Link */}
        <div className="mt-12 text-center">
          <a
            href="https://funpay.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-card border border-border text-text-secondary hover:text-text-primary hover:border-brand/30 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Смотреть все отзывы на FunPay
          </a>
        </div>
      </div>
    </section>
  );
}
