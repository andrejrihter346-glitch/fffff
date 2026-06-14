import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTickets, useTicketMessages } from '../hooks/useTickets';
import type { Ticket } from '../lib/supabase';

const statusLabels: Record<string, { label: string; color: string }> = {
  open: { label: 'Открыт', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  in_progress: { label: 'В работе', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  payment: { label: 'Ожидает оплаты', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  completed: { label: 'Завершён', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  closed: { label: 'Закрыт', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
};

export default function TicketsPanel({ onClose }: { onClose: () => void }) {
  const { profile, isStaff } = useAuth();
  const { tickets, loading, createTicket, assignTicket } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim()) return;

    setCreating(true);
    const ticket = await createTicket(newTicketTitle.trim());
    if (ticket) {
      setNewTicketTitle('');
      setShowCreateForm(false);
      setSelectedTicket(ticket);
    }
    setCreating(false);
  };

  const handleTakeTicket = async (ticket: Ticket) => {
    if (profile) {
      await assignTicket(ticket.id, profile.id);
    }
  };

  if (selectedTicket) {
    return (
      <TicketChat
        ticket={selectedTicket}
        onBack={() => setSelectedTicket(null)}
        onClose={onClose}
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
              {isStaff ? 'Все тикеты' : 'Мои тикеты'}
            </h2>
            <p className="text-xs text-text-secondary">
              {isStaff ? 'Управление заявками клиентов' : 'Ваши заявки на покупку'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-hover border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Create New Ticket */}
          {!isStaff && (
            <div className="mb-4">
              {showCreateForm ? (
                <form onSubmit={handleCreate} className="p-4 rounded-xl bg-surface-hover border border-border">
                  <input
                    type="text"
                    value={newTicketTitle}
                    onChange={(e) => setNewTicketTitle(e.target.value)}
                    placeholder="Опишите что хотите купить..."
                    className="w-full px-4 py-3 rounded-xl bg-surface-card border border-border text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand/50 mb-3"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={creating || !newTicketTitle.trim()}
                      className="flex-1 py-2 rounded-xl bg-brand text-white font-medium disabled:opacity-50"
                    >
                      {creating ? 'Создание...' : 'Создать тикет'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 rounded-xl bg-surface-card border border-border text-text-secondary"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full py-4 rounded-xl border-2 border-dashed border-border text-text-secondary hover:border-brand/30 hover:text-brand-light transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Создать новый тикет
                </button>
              )}
            </div>
          )}

          {/* Tickets List */}
          {loading ? (
            <div className="text-center py-8 text-text-secondary">Загрузка...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-surface-hover flex items-center justify-center mx-auto mb-4 text-3xl">
                📭
              </div>
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
                    <h3 className="text-sm font-medium text-text-primary">{ticket.title}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-medium border ${statusLabels[ticket.status].color}`}>
                      {statusLabels[ticket.status].label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>
                      {isStaff && ticket.profiles?.username && `@${ticket.profiles.username} • `}
                      {new Date(ticket.created_at).toLocaleDateString('ru-RU')}
                    </span>
                    {isStaff && ticket.status === 'open' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTakeTicket(ticket);
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

function TicketChat({ ticket, onBack, onClose }: { ticket: Ticket; onBack: () => void; onClose: () => void }) {
  const { profile, isStaff } = useAuth();
  const { messages, loading, sendMessage, sendPaymentRequest, markPaymentPaid } = useTicketMessages(ticket.id);
  const { updateTicketStatus } = useTickets();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentLink, setPaymentLink] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    await sendMessage(newMessage.trim());
    setNewMessage('');
    setSending(false);
  };

  const handleSendPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || !paymentLink.trim()) return;

    setSending(true);
    await sendPaymentRequest(amount, paymentLink.trim());
    setPaymentAmount('');
    setPaymentLink('');
    setShowPaymentForm(false);
    setSending(false);
  };

  const handleCloseTicket = async () => {
    await updateTicketStatus(ticket.id, 'completed');
    onBack();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-2xl h-[80vh] rounded-2xl bg-surface-card border border-border shadow-2xl flex flex-col overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-brand to-accent" />

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg bg-surface-hover border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-text-primary truncate">{ticket.title}</h2>
            <p className="text-xs text-text-secondary">
              Тикет #{ticket.id.slice(0, 8)}
            </p>
          </div>
          <span className={`shrink-0 px-2 py-1 rounded-md text-xs font-medium border ${statusLabels[ticket.status].color}`}>
            {statusLabels[ticket.status].label}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-text-secondary">Загрузка...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              Начните диалог с сообщения
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.user_id === profile?.id;
              const isPayment = !!msg.payment_link;

              if (isPayment) {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <div className="max-w-sm w-full p-4 rounded-2xl bg-gradient-to-br from-brand/10 to-accent/10 border border-brand/20">
                      <div className="text-center mb-3">
                        <span className="text-2xl">💳</span>
                        <p className="text-lg font-bold gradient-text mt-1">{msg.payment_amount} ₽</p>
                      </div>
                      <a
                        href={msg.payment_link!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2.5 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-white text-center font-semibold text-sm mb-2"
                      >
                        Оплатить на FunPay
                      </a>
                      {msg.payment_status === 'pending' && isStaff && (
                        <button
                          onClick={() => markPaymentPaid(msg.id)}
                          className="w-full py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors"
                        >
                          ✓ Подтвердить оплату
                        </button>
                      )}
                      {msg.payment_status === 'paid' && (
                        <div className="text-center text-green-400 text-sm font-medium">
                          ✓ Оплачено
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${isOwn ? 'order-2' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {!isOwn && msg.profiles && (
                        <>
                          <span className={`text-xs font-medium ${msg.profiles.role !== 'user' ? 'text-brand-light' : 'text-text-secondary'}`}>
                            @{msg.profiles.username}
                          </span>
                          {msg.profiles.role !== 'user' && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand/10 text-brand-light border border-brand/20">
                              {msg.profiles.role === 'admin' ? 'АДМИН' : 'КУРАТОР'}
                            </span>
                          )}
                        </>
                      )}
                    </div>
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
                      {new Date(msg.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        {ticket.status !== 'completed' && ticket.status !== 'closed' && (
          <div className="p-4 border-t border-border">
            {showPaymentForm && isStaff ? (
              <form onSubmit={handleSendPayment} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Сумма ₽"
                    className="w-32 px-3 py-2 rounded-xl bg-surface-hover border border-border text-text-primary focus:outline-none focus:border-brand/50"
                  />
                  <input
                    type="url"
                    value={paymentLink}
                    onChange={(e) => setPaymentLink(e.target.value)}
                    placeholder="Ссылка на FunPay"
                    className="flex-1 px-3 py-2 rounded-xl bg-surface-hover border border-border text-text-primary focus:outline-none focus:border-brand/50"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={sending || !paymentAmount || !paymentLink}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-white font-medium disabled:opacity-50"
                  >
                    Отправить счёт
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="px-4 py-2 rounded-xl bg-surface-hover border border-border text-text-secondary"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSend} className="flex gap-2">
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
                    title="Отправить счёт"
                  >
                    💳
                  </button>
                )}
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-3 rounded-xl bg-brand text-white disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            )}

            {/* Staff Actions */}
            {isStaff && (ticket.status === 'open' || ticket.status === 'in_progress' || ticket.status === 'payment') && (
              <button
                onClick={handleCloseTicket}
                className="w-full mt-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors"
              >
                ✓ Завершить тикет
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
