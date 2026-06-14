import { useState } from 'react';
import { useAuth, validateUsername } from '../hooks/useAuth';

export default function UsernameModal() {
  const { setUsername, needsUsername, user } = useAuth();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!needsUsername || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validateUsername(input);
    if (!validation.valid) {
      setError(validation.error || 'Неверный формат');
      return;
    }

    setLoading(true);
    const result = await setUsername(input);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Ошибка');
    }
  };

  const validation = validateUsername(input);
  const digitCount = (input.match(/\d/g) || []).length;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-2xl bg-surface-card border border-border shadow-2xl animate-fade-in-up">
        <div className="h-1 rounded-t-2xl bg-gradient-to-r from-brand to-accent" />

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-text-primary">Создайте логин</h2>
            <p className="text-sm text-text-secondary mt-1">
              Придумайте уникальный логин для вашего аккаунта
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Логин
                </label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value.toLowerCase());
                    setError('');
                  }}
                  placeholder="например: playerone"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl bg-surface-hover border border-border text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-colors"
                  autoFocus
                />
              </div>

              {/* Requirements */}
              <div className="p-3 rounded-xl bg-surface-hover/50 border border-border">
                <p className="text-xs font-medium text-text-secondary mb-2">Требования:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1.5 ${input.length >= 8 ? 'text-green-400' : 'text-text-secondary'}`}>
                    {input.length >= 8 ? '✓' : '○'} Минимум 8 символов
                  </div>
                  <div className={`flex items-center gap-1.5 ${input.length <= 10 ? 'text-green-400' : 'text-red-400'}`}>
                    {input.length <= 10 ? '✓' : '✗'} Максимум 10 символов
                  </div>
                  <div className={`flex items-center gap-1.5 ${/^[a-zA-Z0-9]*$/.test(input) ? 'text-green-400' : 'text-red-400'}`}>
                    {/^[a-zA-Z0-9]*$/.test(input) ? '✓' : '✗'} Только a-z, 0-9
                  </div>
                  <div className={`flex items-center gap-1.5 ${digitCount <= 2 ? 'text-green-400' : 'text-red-400'}`}>
                    {digitCount <= 2 ? '✓' : '✗'} Макс. 2 цифры ({digitCount}/2)
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!validation.valid || loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {loading ? 'Сохранение...' : 'Продолжить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
