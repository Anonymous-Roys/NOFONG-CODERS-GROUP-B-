import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthStatus = 'unauthenticated' | 'otp_sent' | 'authenticated' | 'profile_pending';

interface AuthContextValue {
  status: AuthStatus;
  phone: string;
  otp: string;
  user?: { id: string; name?: string; email?: string; dob?: string; location?: string };
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  completeProfile: (data: { name: string; email?: string; dob?: string; location?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('unauthenticated');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState<AuthContextValue['user']>();

  const sendOtp = async (newPhone: string) => {
    setPhone(newPhone);
    // mock async network
    await new Promise(r => setTimeout(r, 400));
    const mockOtp = '123456';
    setOtp(mockOtp);
    setStatus('otp_sent');
    if (import.meta.env.DEV) console.info('Mock OTP:', mockOtp);
  };

  const verifyOtp = async (code: string) => {
    await new Promise(r => setTimeout(r, 300));
    const ok = code === otp;
    if (ok) {
      setStatus('profile_pending');
    }
    return ok;
  };

  const completeProfile = async (data: { name: string; email?: string; dob?: string; location?: string }) => {
    await new Promise(r => setTimeout(r, 300));
    setUser({ id: crypto.randomUUID(), ...data });
    setStatus('authenticated');
  };

  const logout = () => {
    setStatus('unauthenticated');
    setPhone('');
    setOtp('');
    setUser(undefined);
  };

  const value = useMemo<AuthContextValue>(() => ({ status, phone, otp, user, sendOtp, verifyOtp, completeProfile, logout }), [status, phone, otp, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


