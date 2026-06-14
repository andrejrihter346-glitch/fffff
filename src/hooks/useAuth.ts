import { useState, useEffect } from 'react';
import { supabase, type Profile } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsUsername, setNeedsUsername] = useState(false);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile;
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setProfile(profile);
        setNeedsUsername(!profile?.username);
      }

      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setProfile(profile);
        setNeedsUsername(!profile?.username);
      } else {
        setProfile(null);
        setNeedsUsername(false);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Ошибка выхода:', error.message);
  };

  const setUsername = async (username: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Не авторизован' };

    // Валидация
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
      .single();

    if (existing) {
      return { success: false, error: 'Этот логин уже занят' };
    }

    // Обновление
    const { error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', user.id);

    if (error) {
      return { success: false, error: 'Ошибка сохранения' };
    }

    // Обновляем локальное состояние
    const updatedProfile = await fetchProfile(user.id);
    setProfile(updatedProfile);
    setNeedsUsername(false);

    return { success: true };
  };

  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchProfile(user.id);
      setProfile(profile);
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
  // Длина 8-10 символов
  if (username.length < 8) {
    return { valid: false, error: 'Минимум 8 символов' };
  }
  if (username.length > 10) {
    return { valid: false, error: 'Максимум 10 символов' };
  }

  // Только английские буквы и цифры
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return { valid: false, error: 'Только английские буквы и цифры' };
  }

  // Максимум 2 цифры
  const digitCount = (username.match(/\d/g) || []).length;
  if (digitCount > 2) {
    return { valid: false, error: 'Максимум 2 цифры' };
  }

  return { valid: true };
}
