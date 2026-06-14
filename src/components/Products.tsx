import { useState, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import TicketsPanel from './TicketsPanel';

type MainTab = 'minecraft' | 'discord';

interface Product {
  name: string;
  description?: string;
  price: string;
  stock?: number | string;
  server?: string;
  tags?: string[];
  autoDelivery?: boolean;
  autoUpdate?: boolean;
}

const mainTabs: { id: MainTab; label: string; icon: ReactNode; color: string }[] = [
  {
    id: 'minecraft',
    label: 'Minecraft',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
      </svg>
    ),
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'discord',
    label: 'Discord',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
      </svg>
    ),
    color: 'from-[#5865F2] to-[#4752c4]',
  },
];

const minecraftSubTabs = [
  { id: 'configs', label: 'Конфиги', icon: '⚙️' },
  { id: 'services', label: 'Услуги', icon: '🛠️' },
  { id: 'other', label: 'Прочее', icon: '📦' },
  { id: 'resourcepacks', label: 'Ресурспаки', icon: '🎨' },
];

const discordSubTabs = [
  { id: 'discord-services', label: 'Услуги Discord', icon: '🤖' },
];

// ========== ТОВАРЫ ==========

const discordServices: Product[] = [
  {
    name: '🤖 Discord бот ◈ YouTube/Twitch/FunPay ◈ Интеграции✨',
    tags: ['Прочее'],
    stock: 20000,
    price: '348.27 ₽',
  },
  {
    name: '🤖 Discord бот ◈ Модерация, Игры и т.п ◈ Под ключ ✨',
    tags: ['Прочее'],
    stock: 9999,
    price: '300.67 ₽',
  },
  {
    name: '🏷️ Дизайн категорий и каналов: уникальные иконки, и т.п.',
    description: 'Создам красивую навигацию! 📂',
    tags: ['Дизайн'],
    stock: 1,
    price: '34.83 ₽',
  },
  {
    name: '🎨 Дизайн для DS Сервера: баннер или иконка/шт.',
    description: 'Создам уникальный стиль. 🖌️',
    tags: ['Дизайн'],
    stock: 100,
    price: '208.96 ₽',
  },
  {
    name: '⚙️ ПРО настройка Discord-сервера',
    description: 'От базовой структуры до систем монетизации и верификации. 🤖✨',
    tags: ['Настройка сервера'],
    stock: 999,
    price: '348.27 ₽',
  },
];

const minecraftConfigs: Product[] = [
  {
    name: '🌙 Celestial【Spooky Дуэли】◈ Конфиг+Шейды+АвтоОбновление✨',
    server: 'SpookyTime 1.16',
    price: '120.16 ₽',
    autoUpdate: true,
  },
  {
    name: '🌙 Celestial【Spooky Duels】◈ Конфиг+Шейдеры ◈ Идеально✨',
    server: 'SpookyTime 1.16',
    price: '90.12 ₽',
  },
  {
    name: '🎁 АВТОВЫДАЧА CFG для agerapvp.club 🎁 LIQUIDBOUNCE LEGACY B100',
    server: 'Другие серверы',
    price: '48.07 ₽',
    autoDelivery: true,
  },
  {
    name: '🏹 Everlast【BravoHvH】◈ Лучший таргет ◈ ТОП✨',
    server: 'BravoHVH',
    price: '96.13 ₽',
  },
  {
    name: '🎂 Everlast конфиг для Cake World',
    description: 'Эффективный гриферский тулсет, стабильная работа',
    server: 'CakeWorld',
    price: '67.29 ₽',
    autoDelivery: true,
  },
  {
    name: '⚔️ Everlast конфиг для Meta HVH',
    description: 'Идеальные настройки под сервер (Grief). Стабильный крит',
    server: 'Другие серверы',
    price: '60.08 ₽',
    autoDelivery: true,
  },
  {
    name: '⚔ Valhalla【Really World】◈ Лучший в PvP ◈ ТОП✨',
    server: 'ReallyWorld',
    price: '75.70 ₽',
  },
  {
    name: '⚡ Wexside【ПОД КЛЮЧ】◈ Индивидуальный конфиг ◈ Гарантия буста✨',
    server: 'Другие серверы',
    price: '79.31 ₽',
  },
  {
    name: '⚡ Wexside【Spooky Duels】◈ Дуэльный конфиг ◈ Автообновление!✨',
    server: 'SpookyTime 1.16',
    price: '144.20 ₽',
    autoUpdate: true,
  },
  {
    name: '⚡ Wexside【ФанТайм】◈ РЕАЛЬНОЕ КФГ FlugerNew ◈ ТОП✨',
    server: 'FunTime 1.16',
    price: '96.13 ₽',
  },
  {
    name: '⚡ Wexside【ФанТайм】◈ 🚀 Автообновление ◈ Лучший в PvP✨',
    description: 'Мое личное кфг',
    server: 'FunTime 1.16',
    price: '120.16 ₽',
    autoUpdate: true,
  },
  {
    name: '✔ Everlast конфиг для Meta HVH',
    description: 'Лучший продукт',
    server: 'Другие серверы',
    price: '168.23 ₽',
    autoUpdate: true,
  },
  {
    name: '🎂 Everlast конфиг для Cake World',
    description: 'Эффективный гриферский',
    server: 'CakeWorld',
    price: '144.20 ₽',
    autoUpdate: true,
    autoDelivery: true,
  },
  {
    name: '💀 Everlast конфиг для Lony Grief',
    description: 'Настройки под гриферскую механику сервера. 🔥',
    server: 'Другие серверы',
    price: '87.72 ₽',
    autoDelivery: true,
  },
  {
    name: '🛡️ Everlast CFG для Wellmine',
    description: 'Адаптированные параметры. Самый лучший для PVP ⚙️',
    server: 'WellMine',
    price: '87.72 ₽',
    autoDelivery: true,
  },
  {
    name: '👻 Everlast конфиг для Spooky Time Anka/Duel 🎭',
    server: 'SpookyTime 1.16',
    price: '96.13 ₽',
    autoDelivery: true,
  },
];

const minecraftOther: Product[] = [
  {
    name: '🎨 КОНФИГУРАЦИЯ PLUGIN TAB (ТАБ-ЛИСТ И СКОРБОД)',
    tags: ['Прочее'],
    server: 'Другие серверы',
    stock: 1000,
    price: '29.33 ₽',
  },
  {
    name: '⚙️ НАСТРОЙКА И ОБНОВЛЕНИЕ СИСТЕМЫ ДОНАТ-РАНГОВ',
    tags: ['Прочее'],
    server: 'Другие серверы',
    stock: 1000,
    price: '146.64 ₽',
  },
  {
    name: '🎮 Создание мода для Minecraft под КЛЮЧ',
    description: '⚡ Быстро, надёжно, с гарантией. ✨',
    tags: ['Прочее'],
    server: 'Другие серверы',
    stock: 997,
    price: '189.41 ₽',
  },
];

const minecraftResourcepacks: Product[] = [
  {
    name: '✨ Шейдеры Флюгера ◈ Эксклюзив ◈ Стиль+FPS✨',
    server: 'FunTime 1.16',
    stock: 99,
    price: '51.78 ₽',
  },
];

const minecraftServices: Product[] = [
  {
    name: '🎬 Превью【Майнкрафт видео】◈ Оформление под ключ',
    description: 'от 100₽✨',
    tags: ['Дизайн'],
    server: 'Другие серверы',
    price: '116.09 ₽',
  },
  {
    name: '⚡ Velocity【Proxy】◈ Настройка под ключ',
    description: 'От 120₽✨',
    tags: ['Настройка сервера'],
    server: 'Другие серверы',
    price: '232.18 ₽',
  },
  {
    name: '🎨 Дизайн сайта Чит Клиента ◈ Стиль+Качество',
    description: 'HTML/CSS/JS✨',
    tags: ['Дизайн'],
    server: 'Другие серверы',
    price: '580.45 ₽',
  },
  {
    name: '🌐 Веб-сайт【БД Майнкрафт】◈ Мониторинг сервера',
    tags: ['Настройка сервера'],
    server: 'Другие серверы',
    price: '336.66 ₽',
  },
  {
    name: '🔧 Самописные плагины для Майнкрафт ⚡',
    description: 'Любая сложность',
    tags: ['Прочее'],
    server: 'Другие серверы',
    price: '191.44 ₽',
  },
  {
    name: '🛠️ Услуги Тех.Админа Minecraft ⚡',
    description: 'Настройка, установка (НЕ разработка плагинов)',
    tags: ['Настройка сервера'],
    server: 'Другие серверы',
    price: '464.36 ₽',
  },
  {
    name: '🚀 Превью-сайты для Minecraft',
    description: 'Под сервер, мод, сборку. От 1 часа. Без регистрации и оплат. 🚀',
    tags: ['Дизайн'],
    server: 'Другие серверы',
    price: '116.09 ₽',
  },
];

// ========== КОМПОНЕНТ ==========

function BuyModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { isAuthenticated } = useAuth();
  const [showTickets, setShowTickets] = useState(false);

  if (showTickets) {
    return <TicketsPanel onClose={() => { setShowTickets(false); onClose(); }} />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-surface-card border border-border shadow-2xl shadow-black/40 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient */}
        <div className="h-1 rounded-t-2xl bg-gradient-to-r from-brand to-accent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-surface-hover border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-brand/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 pt-5">
          {/* Header */}
          <div className="mb-6">
            <span className="text-xs text-text-secondary uppercase tracking-wider font-medium">Покупка товара</span>
            <h3 className="text-base font-bold text-text-primary mt-1.5 leading-snug pr-8">{product.name}</h3>
            {product.description && (
              <p className="text-text-secondary text-xs mt-1">{product.description}</p>
            )}
            <div className="text-xl font-bold gradient-text mt-3">{product.price}</div>
          </div>

          {/* Divider */}
          <div className="border-t border-border mb-6" />

          {/* Payment label */}
          <p className="text-sm font-semibold text-text-primary mb-4">Выберите способ оплаты</p>

          {/* Payment Options */}
          <div className="space-y-3">
            {/* FunPay */}
            <a
              href="https://funpay.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 w-full p-4 rounded-xl bg-surface-hover/50 border border-border hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">FunPay</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[9px] font-bold border border-amber-500/20 uppercase">
                    Популярный
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">Безопасная сделка с гарантией платформы</p>
              </div>
              <svg className="w-5 h-5 text-text-secondary group-hover:text-brand-light group-hover:translate-x-0.5 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Discord Resellers */}
            <a
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 w-full p-4 rounded-xl bg-surface-hover/50 border border-border hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5865F2] to-[#4752c4] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#5865F2]/20 group-hover:shadow-[#5865F2]/40 transition-shadow">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">Discord реселлеры</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[9px] font-bold border border-green-500/20 uppercase">
                    Официальные
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">Покупка через реселлеров на нашем сервере</p>
              </div>
              <svg className="w-5 h-5 text-text-secondary group-hover:text-[#5865F2] group-hover:translate-x-0.5 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Тикет на сайте */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setShowTickets(true);
                } else {
                  alert('Войдите через Discord для создания тикета');
                }
              }}
              className="group flex items-center gap-4 w-full p-4 rounded-xl bg-surface-hover/50 border border-border hover:border-brand/30 hover:bg-brand/5 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand/20 group-hover:shadow-brand/40 transition-shadow">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">Оплата на сайте</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[9px] font-bold border border-cyan-500/20 uppercase">
                    Тикет
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">Создайте тикет и оплатите через модератора</p>
              </div>
              <svg className="w-5 h-5 text-text-secondary group-hover:text-brand-light group-hover:translate-x-0.5 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Info */}
          <div className="mt-5 p-3 rounded-xl bg-brand/5 border border-brand/10">
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-brand-light shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Проблемы с оплатой? Напишите нам в <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="text-brand-light hover:underline">Discord</a> — поможем!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, showServer = false, onBuy }: { product: Product; showServer?: boolean; onBuy: (p: Product) => void }) {
  return (
    <div className="group relative rounded-2xl bg-surface-card border border-border overflow-hidden card-hover">
      <div className="h-1 bg-gradient-to-r from-brand/50 to-accent/50" />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-sm font-semibold text-text-primary leading-snug">{product.name}</h3>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-text-secondary text-xs leading-relaxed mb-3">{product.description}</p>
        )}

        {/* Tags Row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {showServer && product.server && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
              {product.server}
            </span>
          )}
          {product.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-surface-hover text-text-secondary text-[10px] font-medium border border-border"
            >
              {tag}
            </span>
          ))}
          {product.autoDelivery && (
            <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[10px] font-medium border border-green-500/20">
              ✔ Автовыдача
            </span>
          )}
          {product.autoUpdate && (
            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-medium border border-blue-500/20">
              🔄 Автообновление
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="text-lg font-bold gradient-text">{product.price}</div>
            {product.stock !== undefined && (
              <div className="text-[10px] text-text-secondary">
                В наличии: <span className="text-text-primary font-medium">{product.stock}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => onBuy(product)}
            className="px-4 py-2 rounded-xl bg-brand/10 border border-brand/20 text-brand-light text-xs font-semibold hover:bg-brand/20 transition-colors"
          >
            Купить
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [mainTab, setMainTab] = useState<MainTab>('minecraft');
  const [mcSubTab, setMcSubTab] = useState('configs');
  const [dcSubTab, setDcSubTab] = useState('discord-services');
  const [buyProduct, setBuyProduct] = useState<Product | null>(null);

  const currentSubTabs = mainTab === 'minecraft' ? minecraftSubTabs : discordSubTabs;
  const activeSubTab = mainTab === 'minecraft' ? mcSubTab : dcSubTab;

  const getProducts = (): Product[] => {
    if (mainTab === 'discord') {
      return discordServices;
    }
    switch (mcSubTab) {
      case 'configs':
        return minecraftConfigs;
      case 'services':
        return minecraftServices;
      case 'other':
        return minecraftOther;
      case 'resourcepacks':
        return minecraftResourcepacks;
      default:
        return [];
    }
  };

  const products = getProducts();
  const showServer = mainTab === 'minecraft';

  return (
    <section id="products" className="relative py-24 md:py-32 bg-surface-light/50">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
            Каталог
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Наши <span className="gradient-text">продукты</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Готовые решения и кастомная разработка под ваши задачи
          </p>
        </div>

        {/* Main Tabs — Minecraft / Discord */}
        <div className="flex justify-center gap-3 mb-8">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id)}
              className={`group relative flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                mainTab === tab.id
                  ? 'bg-surface-card border border-brand/30 text-text-primary shadow-lg shadow-brand/10 scale-[1.02]'
                  : 'bg-surface-card/40 border border-border text-text-secondary hover:text-text-primary hover:bg-surface-card/70'
              }`}
            >
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
                  mainTab === tab.id
                    ? `bg-gradient-to-br ${tab.color} text-white shadow-md`
                    : 'bg-surface-hover text-text-secondary group-hover:text-text-primary'
                }`}
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sub Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {currentSubTabs.map((sub) => {
            const isActive = activeSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() =>
                  mainTab === 'minecraft' ? setMcSubTab(sub.id) : setDcSubTab(sub.id)
                }
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand/15 border border-brand/30 text-brand-light'
                    : 'bg-surface-card/50 border border-border text-text-secondary hover:text-text-primary hover:border-border'
                }`}
              >
                <span className="text-base">{sub.icon}</span>
                {sub.label}
                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  isActive ? 'bg-brand/20 text-brand-light' : 'bg-surface-hover text-text-secondary'
                }`}>
                  {mainTab === 'discord' 
                    ? discordServices.length 
                    : sub.id === 'configs' 
                      ? minecraftConfigs.length 
                      : sub.id === 'services' 
                        ? minecraftServices.length 
                        : sub.id === 'other' 
                          ? minecraftOther.length 
                          : minecraftResourcepacks.length
                  }
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div key={`${mainTab}-${activeSubTab}`} className="animate-fade-in-up">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <ProductCard key={`${product.name}-${index}`} product={product} showServer={showServer} onBuy={setBuyProduct} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-surface-card border border-border border-dashed">
              <div className="w-16 h-16 rounded-2xl bg-surface-hover flex items-center justify-center text-3xl mb-5">
                📦
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Пусто</h3>
              <p className="text-text-secondary text-sm">Товары скоро появятся</p>
            </div>
          )}
        </div>

        {/* Custom order CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-2xl bg-surface-card border border-border">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-text-primary">Нужна кастомная разработка?</h3>
              <p className="text-text-secondary text-sm mt-1">Свяжитесь с нами в Discord для обсуждения вашего проекта</p>
            </div>
            <a
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-white font-semibold text-sm shadow-lg shadow-brand/20 hover:shadow-brand/40 transition-all hover:scale-[1.02]"
            >
              Написать нам
            </a>
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      {buyProduct && (
        <BuyModal product={buyProduct} onClose={() => setBuyProduct(null)} />
      )}
    </section>
  );
}
