import React from 'react';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { useAuth } from '../../context/AuthContext';
// import { apiFetch } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { sendOtp, error, loading, clearError } = useAuth();
  const [phone, setPhone] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('+233');
  const [localError, setLocalError] = React.useState('');
  const navigate = useNavigate();

  const onSend = async () => {
    setLocalError('');
    clearError();
    
    if (!phone.trim()) {
      setLocalError('Please enter your phone number');
      return;
    }
    
    const fullPhone = countryCode + phone;
    const result = await sendOtp(fullPhone, 'login');
    if (result.success) {
      navigate('/otp', { state: { phone: fullPhone, purpose: 'login' } });
    }
  };

  React.useEffect(() => {
    clearError();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen px-4" style={{backgroundColor: 'var(--color-white)'}}>
      <div className="w-full max-w-md">
        <div className="p-6 border shadow-md bg-white/80 rounded-2xl" style={{borderColor:'var(--color-border-gray)'}}>
          <div className="flex flex-col items-center gap-4 mb-8">
            <img src="/logo.png" alt="logo" width={80}/>
            <h1 className="text-2xl font-semibold" style={{fontFamily:'var(--font-family-heading)', color:'var(--color-text-strong)'}}>Log In</h1>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm" style={{color:'var(--color-text-strong)'}}>Phone Number</label>
            <div className="flex gap-2">
              <select 
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-0 border rounded-full" 
                style={{borderColor:'var(--color-border-gray)'}}
              >
                <option value="+233">🇬🇭 +233</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <Input
                type="tel"
                placeholder="256798179"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setLocalError('');
                  clearError();
                }}
                aria-label="Phone number"
                className="flex-1"
              />
            </div>
            {(error || localError) && (
              <p className="mt-2 text-sm" style={{color:'#dc2626'}}>
                {localError || error}
              </p>
            )}
          </div>

          <Button 
            className="w-full mb-6" 
            type="button" 
            onClick={onSend}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <hr className="flex-1 border-t" style={{borderColor:'var(--color-border-gray)'}} />
            <span className="text-sm" style={{color:'var(--color-medium-gray)'}}>Log in with</span>
            <hr className="flex-1 border-t" style={{borderColor:'var(--color-border-gray)'}} />
          </div>

          <div className="grid gap-3">
            <Button variant="secondary" className="flex items-center justify-center w-full gap-3">
              <span className="text-lg">G</span>
              Continue with Google
            </Button>
            <Button variant="secondary" className="flex items-center justify-center w-full gap-3">
              <span className="text-lg"></span>
              Continue with Apple
            </Button>
          </div>
          <p className="mt-8 text-sm text-center">
            New to this app? <a href="/signup" className="underline" style={{color:'var(--color-brand)'}}>Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


