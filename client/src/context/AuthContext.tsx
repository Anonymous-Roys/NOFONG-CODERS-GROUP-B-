import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../utils/api';

type AuthStatus = 'unauthenticated' | 'otp_sent' | 'authenticated' | 'profile_pending' | 'loading';

interface AuthContextValue {
  status: AuthStatus;
  phone: string;
  otp: string;
  error: string;
  loading: boolean;
  user?: { id: string; name?: string; email?: string; dob?: string; location?: string };
  sendOtp: (phone: string, purpose?: 'login'|'register') => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (otp: string) => Promise<'logged_in' | 'profile_pending' | 'invalid' | 'expired' | 'rate_limited'>;
  completeProfile: (data: { name: string; email?: string; dob?: string; location?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthContextValue['user']>();
  const [lastPurpose, setLastPurpose] = useState<'login'|'register'|'none'>('none');

  const sendOtp = async (newPhone: string, purpose: 'login'|'register' = 'login') => {
    setLoading(true);
    setError('');
    
    try {
      setPhone(newPhone);
      setLastPurpose(purpose);
      const response = await apiFetch('/otp/send', { method: 'POST', body: JSON.stringify({ phone: newPhone, purpose }) });
      
      // Log OTP to console for development
      if (response.devCode) {
        console.log(`🔐 OTP for ${newPhone}: ${response.devCode}`);
      }
      
      setStatus('otp_sent');
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to send verification code';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (code: string) => {
    setLoading(true);
    setError('');
    
    const purpose = lastPurpose === 'none' ? 'login' : lastPurpose;
    
    try {
      const response = await apiFetch('/otp/verify', { 
        method: 'POST', 
        body: JSON.stringify({ phone, code, purpose }) 
      });
      
      if (purpose === 'login') {
        setStatus('authenticated');
        setUser({ id: response.user?.id || 'me', name: response.user?.username || phone });
        return 'logged_in';
      } else {
        setStatus('profile_pending');
        return 'profile_pending';
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      
      if (err.message?.includes('expired')) return 'expired';
      if (err.message?.includes('Too many')) return 'rate_limited';
      return 'invalid';
    } finally {
      setLoading(false);
    }
  };

  const completeProfile = async (data: { name: string; email?: string; dob?: string; location?: string }) => {
    setLoading(true);
    setError('');
    
    try {
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
      // After register, issue token via login by phone
      await apiFetch('/login', { method: 'POST', body: JSON.stringify({ phone }) });
      
      setUser({ id: 'me', name: data.name, dob: data.dob, location: data.location });
      setStatus('authenticated');
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create profile';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiFetch('/logout', { method: 'POST' }).catch(() => {});
    setStatus('unauthenticated');
    setPhone('');
    setOtp('');
    setError('');
    setUser(undefined);
  };

  const clearError = () => setError('');

  useEffect(() => {
    // Try to hit a protected endpoint to infer session
    (async () => {
      try {
        const me = await apiFetch('/protected');
        if (!me || !me.userId) {
          throw new Error('Invalid user data');
        }
        setUser({ id: me.userId, name: me.username });
        setStatus('authenticated');
      } catch (err: any) {
        console.log('No active session found');
        logout();
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ 
    status, phone, otp, error, loading, user, 
    sendOtp, verifyOtp, completeProfile, logout, clearError 
  }), [status, phone, otp, error, loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


