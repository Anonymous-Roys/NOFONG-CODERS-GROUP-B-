import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../utils/api';

type AuthStatus = 'unauthenticated' | 'otp_sent' | 'authenticated' | 'profile_pending' | 'loading';

interface AuthContextValue {
  status: AuthStatus;
  phone: string;
  otp: string;
  user?: { id: string; name?: string; email?: string; dob?: string; location?: string };
  sendOtp: (phone: string, purpose?: 'login'|'register') => Promise<void>;
  verifyOtp: (otp: string) => Promise<'logged_in' | 'profile_pending' | 'invalid'>;
  completeProfile: (data: { name: string; email?: string; dob?: string; location?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState<AuthContextValue['user']>();
  const [lastPurpose, setLastPurpose] = useState<'login'|'register'|'none'>('none');

  const sendOtp = async (newPhone: string, purpose: 'login'|'register' = 'login') => {
    setPhone(newPhone);
    setLastPurpose(purpose);
    await apiFetch('/otp/send', { method: 'POST', body: JSON.stringify({ phone: newPhone, purpose }) });
    setStatus('otp_sent');
  };

  const verifyOtp = async (code: string) => {
    const purpose = lastPurpose === 'none' ? 'login' : lastPurpose;
    try {
      await apiFetch('/otp/verify', { method: 'POST', body: JSON.stringify({ phone, code, purpose }) });
      if (purpose === 'login') {
        setStatus('authenticated');
        setUser({ id: 'me', name: phone });
        return 'logged_in';
      } else {
        setStatus('profile_pending');
        return 'profile_pending';
      }
    } catch {
      return 'invalid';
    }
  };

  const completeProfile = async (data: { name: string; email?: string; dob?: string; location?: string }) => {
    // Map to server's fields
    const payload = {
      phone,
      username: data.name,
      password: 'otp-login',
      dateOfBirth: data.dob || new Date().toISOString(),
      location: data.location || 'Unknown',
      gender: 'Other'
    };
    await apiFetch('/register', { method: 'POST', body: JSON.stringify(payload) });
    // After register, issue token via login by phone (no password check on server when absent)
    await apiFetch('/login', { method: 'POST', body: JSON.stringify({ phone }) });
    setUser({ id: 'me', name: data.name, dob: data.dob, location: data.location });
    setStatus('authenticated');
  };

  const logout = () => {
    apiFetch('/logout', { method: 'POST' }).catch(() => {});
    setStatus('unauthenticated');
    setPhone('');
    setOtp('');
    setUser(undefined);
  };

  useEffect(() => {
    // Try to hit a protected endpoint to infer session
    (async () => {
      try {
        const me = await apiFetch('/protected');
        setUser({ id: me?.userId || 'me', name: me?.username });
        setStatus('authenticated');
      } catch {
        setStatus('unauthenticated');
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ status, phone, otp, user, sendOtp, verifyOtp, completeProfile, logout }), [status, phone, otp, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


