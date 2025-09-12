import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OTPInput from '../../components/ui/Input/OTPInput';
import { Button } from '../../components/ui/Button/Button';
import { useAuth } from '../../context/AuthContext';

type LocationState = { phone: string; purpose: 'login'|'register' } | undefined;

const OtpPage: React.FC = () => {
  const location = useLocation();
  const state = (location.state as LocationState) || { phone: '', purpose: 'login' };
  const navigate = useNavigate();
  const { sendOtp, verifyOtp } = useAuth();
  const [error, setError] = React.useState('');
  const [countdown, setCountdown] = React.useState(30);

  React.useEffect(() => {
    // kick off a countdown for resend
    setCountdown(30);
    const t = setInterval(() => setCountdown((c)=>c>0?c-1:0), 1000);
    return () => clearInterval(t);
  }, [state?.phone, state?.purpose]);

  const onComplete = async (code: string) => {
    const result = await verifyOtp(code);
    if (result === 'invalid') setError('Invalid code. Try again.');
    else if (result === 'profile_pending') navigate('/profile/create');
    else navigate('/');
  };

  const resend = async () => {
    if (countdown > 0) return;
    await sendOtp(state.phone, state.purpose);
    setCountdown(30);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{backgroundColor: 'var(--color-white)'}}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor:'var(--color-light-green)'}}>
            <span style={{color:'var(--color-brand)'}}>🔐</span>
          </div>
          <h1 className="text-2xl font-semibold" style={{fontFamily:'var(--font-family-heading)', color:'var(--color-text-strong)'}}>Enter verification code</h1>
          <p className="text-sm text-gray-600">We sent a code to {state.phone || 'your phone'}</p>
        </div>

        <OTPInput length={6} onComplete={onComplete} />
        {error && <p className="mt-2 text-sm" style={{color:'#dc2626'}}>{error}</p>}

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={()=>navigate(-1)}>Back</Button>
          <Button onClick={resend} disabled={countdown>0}>{countdown>0?`Resend in ${countdown}s`:'Resend code'}</Button>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;


