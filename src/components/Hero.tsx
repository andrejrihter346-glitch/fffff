export default function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface to-surface-light" />
        {/* Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/8 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-dark/5 rounded-full blur-[160px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating cubes decoration */}
      <div className="absolute top-32 right-20 hidden lg:block">
        <div className="w-16 h-16 border border-brand/20 rounded-xl rotate-12 animate-float" />
      </div>
      <div className="absolute bottom-40 left-16 hidden lg:block">
        <div className="w-12 h-12 border border-accent/20 rounded-lg -rotate-12 animate-float" style={{ animationDelay: '2s' }} />
      </div>
      <div className="absolute top-1/2 right-32 hidden lg:block">
        <div className="w-8 h-8 bg-brand/10 rounded-md rotate-45 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium text-brand-light">Активное сообщество 24/7</span>
        </div>

        {/* Heading */}
        <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6" style={{ animationDelay: '0.1s' }}>
          <span className="text-text-primary">Разработка для</span>
          <br />
          <span className="gradient-text">Minecraft</span>
          <span className="text-text-primary"> на новом уровне</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: '0.2s' }}>
          Плагины, моды, ресурс-паки и конфигурации для читов.
          <br className="hidden sm:block" />
          Качественные решения от профессиональной команды разработчиков.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => scrollTo('#products')}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-brand to-brand-dark text-white font-semibold text-base shadow-xl shadow-brand/20 hover:shadow-brand/40 transition-all hover:scale-[1.02]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Наши продукты
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>

          <a
            href="https://discord.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-4 rounded-2xl border border-border bg-surface-card/50 text-text-primary font-semibold text-base hover:bg-surface-hover hover:border-brand/30 transition-all"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
              </svg>
              Discord сервер
            </span>
          </a>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto" style={{ animationDelay: '0.4s' }}>
          {[
            { value: '500+', label: 'Клиентов' },
            { value: '120+', label: 'Продуктов' },
            { value: '24/7', label: 'Поддержка' },
            { value: '99%', label: 'Довольных' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-text-secondary/30 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-brand animate-pulse" />
        </div>
      </div>
    </section>
  );
}
