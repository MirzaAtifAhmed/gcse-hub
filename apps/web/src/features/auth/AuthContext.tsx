import type { AuthUser } from '@gcse-hub/types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login(email: string, password: string): Promise<AuthUser>;
  register(input: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'parent';
    currentYear?: number;
  }): Promise<AuthUser>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, password) {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('gcse-hub-token', res.data.data.token);
        setUser(res.data.data.user);
        return res.data.data.user;
      },
      async register(input) {
        const res = await api.post('/auth/register', input);
        localStorage.setItem('gcse-hub-token', res.data.data.token);
        setUser(res.data.data.user);
        return res.data.data.user;
      },
      async logout() {
        await api.post('/auth/logout');
        localStorage.removeItem('gcse-hub-token');
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
