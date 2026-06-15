import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, type Profile, type TicketMessage } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { profile: myProfile, isAdmin, isAuthenticated } = useAuth();
  
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  // Проверка доступа: только админ или сам пользователь
  const canView = isAdmin || myProfile?.username === username;
  const canChat = isAdmin || myProfile?.id === user?.id;

  useEffect(() => {
    fetchUser();
  }, [username]);

  const fetchUser = async () => {
    if (!username) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setUser(data as Profile);
      // Ищем или создаём чат
      await findOrCreateChat(data.id);
    }
    setLoading(false);
  };

  const findOrCreateChat = async (userId: string) => {
    if (!myProfile) return;

    // Ищем существующий личный чат (тикет с типом 'dm')
    // Используем специальный формат title для DM: "dm:user1_id:user2_id"
    const sortedIds = [myProfile.id, userId].sort().join(':');
    const dmTitle = `dm:${sortedIds}`;

    const { data: existingTicket } = await supabase
      .from('tickets')
      .select('id')
      .eq('title', dmTitle)
      .single();

    if (existingTicket) {
      setChatId(existingTicket.id);
      fetchMessages(existingTicket.id);
    }
    // Чат создастся при первом сообщении
  };

  const fetchMessages = useCallback(async (ticketId: string) => {
    const { data } = await supabase
      .from('ticket_messages')
      .select('*, profiles(*)')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data as TicketMessage[]);
    }
  }, []);

  useEffect(() => {
    if (!chatId) return;

    // Realtime подписка
    const channel = supabase
      .channel(`dm-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ticket_messages',
          filter: `ticket_id=eq.${chatId}`
        },
        () => fetchMessages(chatId)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !myProfile || !user) return;

    setSending(true);

    let currentChatId = chatId;

    // Создаём чат если его нет
    if (!currentChatId) {
      const sortedIds = [myProfile.id, user.id].sort().join(':');
      const dmTitle = `dm:${sortedIds}`;

      const { data: newTicket, error } = await supabase
        .from('tickets')
        .insert({
          user_id: user.id, // владелец - пользователь чьй профиль
          title: dmTitle,
          status: 'open'
        })
        .select()
        .single();

      if (error || !newTicket) {
        console.error('Error creating chat:', error);
        setSending(false);
        return;
      }

      currentChatId = newTicket.id;
      setChatId(currentChatId);
    }

    // Отправляем сообщение
    await supabase.from('ticket_messages').insert({
      ticket_id: currentChatId,
      user_id: myProfile.id,
      message: newMessage.trim()
    });

    setNewMessage('');
    setSending(false);
    if (currentChatId) fetchMessages(currentChatId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-text-secondary">Загрузка...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Пользователь не найден</h1>
          <p className="text-text-secondary mb-6">Профиль @{username} не существует</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl bg-brand text-white font-semibold"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Доступ запрещён</h1>
          <p className="text-text-secondary mb-6">Только администраторы могут просматривать профили</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl bg-brand text-white font-semibold"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/10 text-red-400 border-red-500/20',
    curator: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    user: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  const roleLabels: Record<string, string> = {
    admin: 'Администратор',
    curator: 'Куратор',
    user: 'Пользователь',
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="border-b border-border bg-surface-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-xl bg-surface-hover border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-primary">Профиль пользователя</h1>
            <p className="text-xs text-text-secondary">@{username}</p>
          </div>
          {isAdmin && (
            <span className="ml-auto px-2 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
              ADMIN VIEW
            </span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-surface-card border border-border p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username || ''}
                    className="w-24 h-24 rounded-2xl mx-auto object-cover border-4 border-surface-hover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl mx-auto bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold text-3xl">
                    {(user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <h2 className="text-xl font-bold text-text-primary mt-4">@{user?.username}</h2>
                <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-semibold border ${roleColors[user?.role || 'user']}`}>
                  {roleLabels[user?.role || 'user']}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Discord ID</span>
                  <span className="text-xs text-text-primary font-mono">{user?.discord_id || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Регистрация</span>
                  <span className="text-xs text-text-primary">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">User ID</span>
                  <span className="text-xs text-text-primary font-mono truncate max-w-[120px]" title={user?.id}>
                    {user?.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-surface-card border border-border flex flex-col h-[500px]">
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-bold text-text-primary">Личные сообщения</h3>
                <p className="text-xs text-text-secondary">
                  {isAdmin ? 'Чат с пользователем' : 'Чат с администрацией'}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!canChat ? (
                  <div className="text-center py-8 text-text-secondary">
                    <div className="text-4xl mb-2">🔒</div>
                    <p className="text-sm">У вас нет доступа к этому чату</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-text-secondary">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-sm">Начните диалог</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.user_id === myProfile?.id;
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%]`}>
                          <div className="flex items-center gap-2 mb-1">
                            {!isOwn && msg.profiles && (
                              <span className={`text-xs font-medium ${msg.profiles.role !== 'user' ? 'text-brand-light' : 'text-text-secondary'}`}>
                                @{msg.profiles.username}
                                {msg.profiles.role === 'admin' && ' 👑'}
                              </span>
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
              {canChat && isAuthenticated && (
                <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Сообщение..."
                    className="flex-1 px-4 py-3 rounded-xl bg-surface-hover border border-border text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand/50"
                  />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
