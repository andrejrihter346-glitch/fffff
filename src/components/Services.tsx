const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    ),
    title: 'Плагины',
    description: 'Разработка кастомных плагинов для Bukkit, Spigot, Paper и других серверных платформ. От мини-игр до сложных систем.',
    tags: ['Bukkit', 'Spigot', 'Paper', 'Velocity'],
    color: 'from-purple-500 to-violet-600',
    glowColor: 'shadow-purple-500/20',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Ресурс-паки',
    description: 'Кастомные текстуры, модели, звуки и шейдеры. Уникальный визуальный стиль для вашего сервера или клиента.',
    tags: ['Текстуры', 'Модели', '3D', 'Шейдеры'],
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'shadow-cyan-500/20',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'Моды',
    description: 'Модификации для Forge и Fabric. Новые блоки, предметы, мобы, механики — воплотим любую идею в реальность.',
    tags: ['Forge', 'Fabric', 'NeoForge', 'Quilt'],
    color: 'from-orange-500 to-red-600',
    glowColor: 'shadow-orange-500/20',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Конфиги для читов',
    description: 'Профессиональные конфигурации для популярных чит-клиентов. Оптимальные настройки для PvP, HvH и Blatant.',
    tags: ['PvP', 'HvH', 'Blatant', 'Configs'],
    color: 'from-emerald-500 to-teal-600',
    glowColor: 'shadow-emerald-500/20',
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand-light text-sm font-medium mb-4">
            Наши направления
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Чем мы <span className="gradient-text">занимаемся</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Полный спектр услуг для Minecraft — от серверных плагинов до клиентских модификаций
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative rounded-2xl bg-surface-card border border-border p-8 card-hover overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Hover gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} text-white mb-6 shadow-lg ${service.glowColor}`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-text-primary mb-3">{service.title}</h3>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed mb-5">{service.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-surface-hover text-text-secondary text-xs font-medium border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
