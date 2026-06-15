import { useState, useEffect, useCallback } from 'react';
import { supabase, type Profile } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsUsername, setNeedsUsername] = useState(false);

  // Получить или создать профиль
  const ensureProfile = useCallback(async (authUser: User): Promise<Profile | null> => {
    try {
      // Сначала пробуем получить
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data) return data as Profile;

      // Если профиля нет — создаём (триггер мог не сработать)
      if (error && error.code === 'PGRST116') {
        const meta = authUser.user_metadata;
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .upsert({
            id: authUser.id,
            discord_id: meta?.provider_id || null,
            avatar_url: meta?.avatar_url || null,
            role: 'user',
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          return null;
        }
        return newProfile as Profile;
      }

      console.error('Error fetching profile:', error);
      return null;
    } catch (err) {
      console.error('Profile error:', err);
      return null;
    }
  }, []);

  const handleSession = useCallback(async (newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);

    if (newSession?.user) {
      const p = await ensureProfile(newSession.user);
      setProfile(p);
      setNeedsUsername(p ? !p.username : false);
    } else {
      setProfile(null);
      setNeedsUsername(false);
    }

    setLoading(false);
  }, [ensureProfile]);

  useEffect(() => {
    // 1. Получить текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // 2. Слушать изменения (логин, логаут, токен обновился)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signInWithDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) console.error('Ошибка авторизации:', error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    setNeedsUsername(false);
  };

  const setUsername = async (username: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Не авторизован' };

    const validation = validateUsername(username);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Проверка уникальности
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user.id)
      .maybeSingle();

    if (existing) {
      return { success: false, error: 'Этот логин уже занят' };
    }

    // Upsert — создаст или обновит
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username,
        discord_id: user.user_metadata?.provider_id || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error saving username:', error);
      return { success: false, error: `Ошибка: ${error.message}` };
    }

    // Обновляем локальное состояние
    const updatedProfile = await ensureProfile(user);
    setProfile(updatedProfile);
    setNeedsUsername(false);

    return { success: true };
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await ensureProfile(user);
      setProfile(p);
    }
  };

  return {
    user,
    profile,
    session,
    loading,
    needsUsername,
    signInWithDiscord,
    signOut,
    setUsername,
    refreshProfile,
    isAuthenticated: !!session,
    isAdmin: profile?.role === 'admin',
    isCurator: profile?.role === 'curator',
    isStaff: profile?.role === 'admin' || profile?.role === 'curator',
  };
}

// Валидация username
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (username.length < 8) {
    return { valid: false, error: 'Минимум 8 символов' };
  }
  if (username.length > 10) {
    return { valid: false, error: 'Максимум 10 символов' };
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return { valid: false, error: 'Только английские буквы и цифры' };
  }
  const digitCount = (username.match(/\d/g) || []).length;
  if (digitCount > 2) {
    return { valid: false, error: 'Максимум 2 цифры' };
  }
  return { valid: true };
}
