import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTickets, useTicketMessages, type CreateTicketData, type TicketPurpose, type PaymentMethod } from '../hooks/useTickets';
import type { Ticket } from '../lib/supabase';

// Список товаров из каталога (упрощённый)
const catalogProducts = [
  '🤖 Discord бот ◈ YouTube/Twitch/FunPay',
  '🤖 Discord бот ◈ Модерация, Игры',
  '🏷️ Дизайн категорий и каналов',
  '🎨 Дизайн для DS Сервера',
  '⚙️ ПРО настройка Discord-сервера',
  '🌙 Celestial【Spooky Дуэли】',
  '⚡ Wexside【ФанТайм】',
  '🛠️ Услуги Тех.Админа Minecraft',
  '✨ Шейдеры Флюгера',
  'Другой товар...'
];

const statusLabels: Record<string, { label: string; color: string }> = {
  open: { label: 'Открыт', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  in_progress: { label: 'В работе', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  payment: { label: 'Ожидает оплаты', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  completed: { label: 'Завершён', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  closed: { label: 'Закрыт', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
};

export default function TicketsPanel({ onClose }: { onClose: () => void }) {
  const { isStaff } = useAuth();
  const { tickets, loading, createTicket, joinTicket } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (selectedTicket) {
    return (
      <TicketChat
        ticket={selectedTicket}
        onBack={() => setSelectedTicket(null)}
        onClose={onClose}
      />
    );
  }

  if (showCreateForm) {
    return (
      <CreateTicketForm
        onBack={() => setShowCreateForm(false)}
        onClose={onClose}
        onCreate={async (data) => {
          const ticket = await createTicket(data);
          if (ticket) {
            setShowCreateForm(false);
            setSelectedTicket(ticket);
          }
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-2xl max-h-[80vh] rounded-2xl bg-surface-card border border-border shadow-2xl flex flex-col overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-brand to-accent" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              {isStaff ? '📋 Все тикеты' : '💬 Мои тикеты'}
            </h2>
            <p className="text-xs text-text-secondary">
              {isStaff ? 'Управление заявками клиентов' : 'Ваши заявки и чаты с поддержкой'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-hover border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Create Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full py-4 rounded-xl border-2 border-dashed border-border text-text-secondary hover:border-brand/30 hover:text-brand-light transition-colors flex items-center justify-center gap-2 mb-4"
          >
            <span className="text-xl">➕</span>
            Создать новый тикет
          </button>

          {/* Tickets List */}
          {loading ? (
            <div className="text-center py-8 text-text-secondary">Загрузка...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-text-secondary">
                {isStaff ? 'Нет активных тикетов' : 'У вас пока нет тикетов'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 rounded-xl bg-surface-hover border border-border hover:border-brand/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs font-mono text-brand-light">
                        #{(ticket as any).ticket_code || ticket.id.slice(0, 5).toUpperCase()}
                      </span>
                      <h3 className="text-sm font-medium text-text-primary">{ticket.title}</h3>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-medium border ${statusLabels[ticket.status]?.color || statusLabels.open.color}`}>
                      {statusLabels[ticket.status]?.label || 'Открыт'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>
                      {isStaff && (ticket as any).profiles?.username && `@${(ticket as any).profiles.username} • `}
                      {new Date(ticket.created_at).toLocaleDateString('ru-RU')}
                    </span>
                    {isStaff && ticket.status === 'open' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          joinTicket(ticket.id);
                        }}
                        className="px-2 py-1 rounded-lg bg-brand/10 text-brand-light hover:bg-brand/20 transition-colors"
                      >
                        Взять в работу
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== CREATE TICKET FORM ====================

function CreateTicketForm({ onBack, onClose, onCreate }: {
  onBack: () => void;
  onClose: () => void;
  onCreate: (data: CreateTicketData) => Promise<void>;
}) {
  const [purpose, setPurpose] = useState<TicketPurpose | null>(null);
  const [productName, setProductName] = useState('');
  const [customProduct, setCustomProduct] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('site');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async () => {
    if (!purpose) return;
    setCreating(true);

    const data: CreateTicketData = { purpose };
    
    if (purpose === 'purchase') {
      data.productName = productName === 'Другой товар...' ? customProduct : productName;
      data.paymentMethod = paymentMethod;
    } else {
      data.description = description;
    }

    await onCreate(data);
    setCreating(false);
  };

  const canSubmit = purpose && (
    (purpose === 'purchase' && (productName && (productName !== 'Другой товар...' || customProduct))) ||
    (purpose === 'support' && description.trim().length > 10)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg max-h-[85vh] rounded-2xl bg-surface-card border border-border shadow-2xl flex flex-col overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-brand to-accent" />

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg bg-surface-hover border border-border flex items-center justify-center text-text-secondary hover:text-text-primary"
          >
            ←
          </button>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Новый тикет</h2>
            <p className="text-xs text-text-secondary">Заполните форму</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Purpose Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              С какой целью обращаетесь?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPurpose('purchase')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  purpose === 'purchase'
                    ? 'border-brand bg-brand/10'
                    : 'border-border hover:border-brand/30'
                }`}
              >
                <span className="text-2xl block mb-1">🛒</span>
                <span className="text-sm font-medium text-text-primary">Покупка</span>
                <p className="text-xs text-text-secondary mt-0.5">Хочу купить товар</p>
              </button>
              <button
                onClick={() => setPurpose('support')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  purpose === 'support'
                    ? 'border-brand bg-brand/10'
                    : 'border-border hover:border-brand/30'
                }`}
              >
                <span className="text-2xl block mb-1">❓</span>
                <span className="text-sm font-medium text-text-primary">Поддержка</span>
                <p className="text-xs text-text-secondary mt-0.5">Вопрос или проблема</p>
              </button>
            </div>
          </div>

          {/* Purchase Form */}
          {purpose === 'purchase' && (
            <>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Выберите товар
                </label>
                <select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-hover border border-border text-text-primary focus:outline-none focus:border-brand/50"
                >
                  <option value="">-- Выберите товар --</option>
                  {catalogProducts.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {productName === 'Другой товар...' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Опишите что хотите купить
                  </label>
                  <input
                    type="text"
                    value={customProduct}
                    onChange={(e) => setCustomProduct(e.target.value)}
                    placeholder="Название товара или услуги..."
                    className="w-full px-4 py-3 rounded-xl bg-surface-hover border border-border text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand/50"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Способ оплаты
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'site', label: '💳 На сайте (через тикет)', desc: 'Оплата через модератора' },
                    { id: 'funpay', label: '🛒 FunPay', desc: 'Безопасная сделка' },
                    { id: 'reseller', label: '🤝 Через реселлера', desc: 'В Discord сервере' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === m.id
                          ? 'border-brand bg-brand/10'
                          : 'border-border hover:border-brand/30'
                      }`}
                    >
                      <span className="text-sm font-medium text-text-primary">{m.label}</span>
                      <p className="text-xs text-text-secondary">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Support Form */}
          {purpose === 'support' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Опишите вашу проблему
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Подробно опишите с чем вам нужна помощь..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-surface-hover border border-border text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand/50 resize-none"
              />
              <p className="text-xs text-text-secondary mt-1">
                Минимум 10 символов ({description.length}/10)
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || creating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {creating ? 'Создание...' : 'Создать тикет'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== TICKET CHAT ====================

function TicketChat({ ticket, onBack, onClose }: {
  ticket: Ticket;
  onBack: () => void;
  onClose: () => void;
}) {
  const { profile, isStaff } = useAuth();
  const { messages, loading, sendMessage, sendPaymentCard, confirmPayment, formatTimeMSK } = useTicketMessages(ticket.id);
  const { closeTicket, reopenTicket, refreshTickets } = useTickets();
  
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showCloseForm, setShowCloseForm] = useState(false);
  const [closeReason, setCloseReason] = useState('');
  
  // Payment form
  const [payProductName, setPayProductName] = useState((ticket as any).product_name || '');
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('site');
  const [payLink, setPayLink] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isClosed = ticket.status === 'closed';
  const ticketCode = (ticket as any).ticket_code || ticket.id.slice(0, 5).toUpperCase();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isClosed) return;
    setSending(true);
    await sendMessage(newMessage.trim());
    setNewMessage('');
    setSending(false);
  };

  const handleSendPayment = async () => {
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || !payProductName) return;
    setSending(true);
    await sendPaymentCard(payProductName, amount, payMethod, payLink || undefined);
    setShowPaymentForm(false);
    setPayAmount('');
    setPayLink('');
    setSending(false);
  };

  const handleClose = async () => {
    if (!closeReason.trim()) return;
    await closeTicket(ticket.id, closeReason);
    await refreshTickets();
    setShowCloseForm(false);
    onBack();
  };

  const handleReopen = async () => {
    await reopenTicket(ticket.id);
    await refreshTickets();
  };

  // Рендер сообщения
  const renderMessage = (msg: any) => {
    const isOwn = msg.user_id === profile?.id;
    const isSystem = msg.is_system;
    const senderName = msg.profiles?.username || 'Пользователь';
    const senderRole = msg.profiles?.role;
    const time = formatTimeMSK(msg.created_at);

    // Системные сообщения
    if (isSystem) {
      const systemType = msg.system_type;

      // Карточка покупки
      if (systemType === 'purchase_card') {
        try {
          const data = JSON.parse(msg.message);
          return (
            <div key={msg.id} className="flex justify-center my-4">
              <div className="max-w-sm w-full p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <div className="text-center mb-3">
                  <span className="text-2xl">🛒</span>
                  <p className="text-sm font-bold text-text-primary mt-1">Запрос на покупку</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Товар:</span>
                    <span className="text-text-primary font-medium">{data.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Оплата:</span>
                    <span className="text-text-primary">{data.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        } catch { return null; }
      }

      // Карточка оплаты
      if (systemType === 'payment') {
        try {
          const data = JSON.parse(msg.message);
          const isPaid = msg.payment_status === 'paid';
          return (
            <div key={msg.id} className="flex justify-center my-4">
              <div className="max-w-sm w-full p-4 rounded-2xl bg-gradient-to-br from-brand/10 to-accent/10 border border-brand/20">
                <div className="text-center mb-3">
                  <span className="text-2xl">💳</span>
                  <p className="text-lg font-bold gradient-text mt-1">{data.amount} ₽</p>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Товар:</span>
                    <span className="text-text-primary font-medium">{data.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Способ:</span>
                    <span className="text-text-primary">{data.paymentMethod}</span>
                  </div>
                </div>
                {data.paymentLink && !isPaid && (
                  <a
                    href={data.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-white text-center font-semibold text-sm mb-2"
                  >
                    Оплатить
                  </a>
                )}
                {isPaid ? (
                  <div className="text-center text-green-400 text-sm font-medium py-2">
                    ✅ Оплачено
                  </div>
                ) : (
                  isStaff && (
                    <button
                      onClick={() => confirmPayment(msg.id)}
                      className="w-full py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors"
                    >
                      ✓ Подтвердить оплату
                    </button>
                  )
                )}
              </div>
            </div>
          );
        } catch { return null; }
      }

      // Другие системные сообщения
      return (
        <div key={msg.id} className="flex justify-center my-3">
          <div className="px-4 py-2 rounded-full bg-surface-hover border border-border text-xs text-text-secondary">
            <span className="font-medium text-text-primary">@{senderName}</span>
            {' '}{msg.message}
            <span className="ml-2 opacity-60">{time}</span>
          </div>
        </div>
      );
    }

    // Обычные сообщения
    return (
      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`max-w-[75%]`}>
          {!isOwn && (
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium ${senderRole !== 'user' ? 'text-brand-light' : 'text-text-secondary'}`}>
                @{senderName}
              </span>
              {senderRole === 'admin' && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                  АДМИН
                </span>
              )}
              {senderRole === 'curator' && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  КУРАТОР
                </span>
              )}
            </div>
          )}
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm ${
              isOwn
                ? 'bg-brand text-white rounded-br-md'
                : 'bg-surface-hover border border-border text-text-primary rounded-bl-md'
            }`}
          >
            {msg.message}
          </div>
          <div className={`text-[10px] text-text-secondary mt-1 ${isOwn ? 'text-right' : ''}`}>
            {time}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-2xl h-[85vh] rounded-2xl bg-surface-card border border-border shadow-2xl flex flex-col overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-brand to-accent" />

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg bg-surface-hover border border-border flex items-center justify-center text-text-secondary hover:text-text-primary"
          >
            ←
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-brand-light">#{ticketCode}</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${statusLabels[ticket.status]?.color || statusLabels.open.color}`}>
                {statusLabels[ticket.status]?.label || 'Открыт'}
              </span>
            </div>
            <h2 className="text-sm font-bold text-text-primary truncate">{ticket.title}</h2>
          </div>
          
          {/* Admin Actions */}
          {isStaff && (
            <div className="flex gap-2">
              {isClosed ? (
                <button
                  onClick={handleReopen}
                  className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/20"
                >
                  🔓 Открыть
                </button>
              ) : (
                <button
                  onClick={() => setShowCloseForm(true)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20"
                >
                  🔒 Закрыть
                </button>
              )}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-text-secondary">Загрузка...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <span className="text-4xl block mb-2">💬</span>
              Начните диалог
            </div>
          ) : (
            <>
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Close Form */}
        {showCloseForm && (
          <div className="p-4 border-t border-border bg-red-500/5">
            <p className="text-sm font-medium text-text-primary mb-2">Причина закрытия:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                placeholder="Укажите причину..."
                className="flex-1 px-4 py-2 rounded-xl bg-surface-hover border border-border text-text-primary focus:outline-none focus:border-brand/50"
              />
              <button
                onClick={handleClose}
                disabled={!closeReason.trim()}
                className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium disabled:opacity-50"
              >
                Закрыть
              </button>
              <button
                onClick={() => setShowCloseForm(false)}
                className="px-4 py-2 rounded-xl bg-surface-hover border border-border text-text-secondary"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Payment Form */}
        {showPaymentForm && isStaff && (
          <div className="p-4 border-t border-border bg-brand/5">
            <p className="text-sm font-medium text-text-primary mb-3">💳 Создать счёт для клиента</p>
            <div className="space-y-3">
              <input
                type="text"
                value={payProductName}
                onChange={(e) => setPayProductName(e.target.value)}
                placeholder="Название товара"
                className="w-full px-4 py-2 rounded-xl bg-surface-hover border border-border text-text-primary focus:outline-none focus:border-brand/50"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="Сумма ₽"
                  className="w-32 px-4 py-2 rounded-xl bg-surface-hover border border-border text-text-primary focus:outline-none focus:border-brand/50"
                />
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="flex-1 px-4 py-2 rounded-xl bg-surface-hover border border-border text-text-primary focus:outline-none focus:border-brand/50"
                >
                  <option value="site">На сайте</option>
                  <option value="funpay">FunPay</option>
                  <option value="reseller">Через реселлера</option>
                </select>
              </div>
              <input
                type="url"
                value={payLink}
                onChange={(e) => setPayLink(e.target.value)}
                placeholder="Ссылка на оплату (опционально)"
                className="w-full px-4 py-2 rounded-xl bg-surface-hover border border-border text-text-primary focus:outline-none focus:border-brand/50"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSendPayment}
                  disabled={!payProductName || !payAmount || sending}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-white font-medium disabled:opacity-50"
                >
                  Отправить счёт
                </button>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="px-4 py-2 rounded-xl bg-surface-hover border border-border text-text-secondary"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        {!isClosed && !showCloseForm && !showPaymentForm && (
          <form onSubmit={handleSend} className="p-4 border-t border-border flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Сообщение..."
              className="flex-1 px-4 py-3 rounded-xl bg-surface-hover border border-border text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand/50"
            />
            {isStaff && (
              <button
                type="button"
                onClick={() => setShowPaymentForm(true)}
                className="px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors"
                title="Создать счёт"
              >
                💳
              </button>
            )}
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-4 py-3 rounded-xl bg-brand text-white disabled:opacity-50"
            >
              📤
            </button>
          </form>
        )}

        {/* Closed notice */}
        {isClosed && !isStaff && (
          <div className="p-4 border-t border-border bg-gray-500/10 text-center text-text-secondary text-sm">
            🔒 Тикет закрыт. Вы не можете отправлять сообщения.
          </div>
        )}
      </div>
    </div>
  );
}
