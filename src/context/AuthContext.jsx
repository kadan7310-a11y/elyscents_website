import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);
const KEY = 'elyscents_token';

function readToken() {
  try {
    return localStorage.getItem(KEY) || '';
  } catch (e) {
    return '';
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readToken);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(readToken()));

  const saveSession = useCallback((data) => {
    try {
      localStorage.setItem(KEY, data.token);
    } catch (e) {
      /* storage unavailable, session lasts until reload */
    }
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch (e) {
      /* ignore */
    }
    setToken('');
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setLoading(false);
      return undefined;
    }
    api('/auth/me', { token })
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) logout();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await api('/auth/login', { method: 'POST', body: { email, password } });
      saveSession(data);
      return data.user;
    },
    [saveSession]
  );

  const register = useCallback(
    async (name, email, password) => {
      const data = await api('/auth/register', { method: 'POST', body: { name, email, password } });
      saveSession(data);
      return data.user;
    },
    [saveSession]
  );

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
