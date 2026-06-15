import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, type Profile } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const { isAdmin, profile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data as Profile[]);
    }
    setLoading(false);
  };

  const updateRole = async (userId: string, role: 'user' | 'curator' | 'admin') => {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      console.error('Error updating role:', error);
      return;
    }

    await fetchUsers();
  };

  if (!isAdmin) {
    return null;
  }

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.discord_id?.includes(search)
  );

  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/10 text-red-400 border-red-500/20',
    curator: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    user: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  const roleLabels: Record<string, string> = {
    admin: 'Админ',
    curator: 'Куратор',
    user: 'Юзер',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-3xl max-h-[80vh] rounded-2xl bg-surface-card border border-border shadow-2xl flex flex-col overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
                ADMIN
              </span>
              Панель управления
            </h2>
            <p className="text-xs text-text-secondary">Управление пользователями и ролями</p>
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

        {/* Search */}
        <div className="p-4 border-b border-border">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по username или Discord ID..."
            className="w-full px-4 py-2.5 rounded-xl bg-surface-hover border border-border text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand/50"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 p-4 border-b border-border">
          <div className="p-3 rounded-xl bg-surface-hover border border-border text-center">
            <div className="text-2xl font-bold text-text-primary">{users.length}</div>
            <div className="text-xs text-text-secondary">Всего</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-hover border border-border text-center">
            <div className="text-2xl font-bold text-purple-400">
              {users.filter((u) => u.role === 'curator').length}
            </div>
            <div className="text-xs text-text-secondary">Кураторов</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-hover border border-border text-center">
            <div className="text-2xl font-bold text-red-400">
              {users.filter((u) => u.role === 'admin').length}
            </div>
            <div className="text-xs text-text-secondary">Админов</div>
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-text-secondary">Загрузка...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              Пользователи не найдены
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isCurrentUser = user.id === profile?.id;

                return (
                  <div
                    key={user.id}
                    className={`p-4 rounded-xl border ${
                      isCurrentUser
                        ? 'bg-brand/5 border-brand/20'
                        : 'bg-surface-hover border-border'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.username || 'User'}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold">
                          {(user.username || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {user.username ? (
                            <button
                              onClick={() => {
                                onClose();
                                navigate(`/user/${user.username}`);
                              }}
                              className="text-sm font-medium text-text-primary hover:text-brand-light transition-colors"
                            >
                              @{user.username}
                            </button>
                          ) : (
                            <span className="text-sm font-medium text-text-secondary">
                              Без логина
                            </span>
                          )}
                          {isCurrentUser && (
                            <span className="text-[10px] text-text-secondary">(вы)</span>
                          )}
                        </div>
                        <div className="text-xs text-text-secondary truncate">
                          Discord: {user.discord_id || 'N/A'}
                        </div>
                      </div>

                      {/* Role Badge */}
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>

                      {/* Role Actions */}
                      {!isCurrentUser && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateRole(user.id, 'user')}
                            className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                              user.role === 'user'
                                ? 'bg-gray-500/20 text-gray-300'
                                : 'bg-surface-card border border-border text-text-secondary hover:text-text-primary'
                            }`}
                          >
                            Юзер
                          </button>
                          <button
                            onClick={() => updateRole(user.id, 'curator')}
                            className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                              user.role === 'curator'
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-surface-card border border-border text-text-secondary hover:text-purple-400'
                            }`}
                          >
                            Куратор
                          </button>
                          <button
                            onClick={() => updateRole(user.id, 'admin')}
                            className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                              user.role === 'admin'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-surface-card border border-border text-text-secondary hover:text-red-400'
                            }`}
                          >
                            Админ
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
