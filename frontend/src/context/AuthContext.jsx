import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('sr_token');
    if (!token) { setLoading(false); return; }
    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setWallet(data.wallet);
    } catch {
      localStorage.removeItem('sr_token');
      delete api.defaults.headers.common.Authorization;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('sr_token', data.token);
    api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    setUser(data.user);
    setWallet(data.wallet);
    return data;
  };

  const register = async (form) => {
    const { data } = await api.post('/auth/register', form);
    localStorage.setItem('sr_token', data.token);
    api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    setUser(data.user);
    setWallet(data.wallet);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('sr_token');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
    setWallet(null);
  };

  const updateWalletState = (w) => setWallet(w);

  return (
    <AuthContext.Provider value={{ user, wallet, loading, login, register, logout, refreshUser, updateWalletState, setWallet }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
