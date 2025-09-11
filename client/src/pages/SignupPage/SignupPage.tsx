import React, { useState } from 'react';
import { Button } from '../../components/ui/Button/Button';
import OTPInput from '../../components/ui/Input/OTPInput';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const { verifyOtp } = useAuth();
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleComplete = async (code: string) => {
    const ok = await verifyOtp(code);
    if (!ok) setError('Invalid code. Try 123456');
    else navigate('/profile/create');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{backgroundColor: 'var(--color-white)'}}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor:'var(--color-light-green)'}}>
            <span style={{color:'var(--color-brand)'}}>🌱</span>
          </div>
          <h1 className="text-2xl font-semibold" style={{fontFamily:'var(--font-family-heading)', color:'var(--color-text-strong)'}}>Create Your Account</h1>
        </div>

        <div className="mb-3" style={{color:'var(--color-text-strong)'}}>Enter OTP</div>
        <OTPInput length={6} onComplete={handleComplete} />
        {error && <p className="mt-2 text-sm" style={{color:'#dc2626'}}>{error}</p>}

        <Button className="w-full mt-8">Sign Up</Button>

        <div className="flex items-center gap-4 my-6">
          <hr className="flex-1 border-t" style={{borderColor:'var(--color-border-gray)'}} />
          <span className="text-sm" style={{color:'var(--color-medium-gray)'}}>Sign up with</span>
          <hr className="flex-1 border-t" style={{borderColor:'var(--color-border-gray)'}} />
        </div>

        <div className="grid gap-3">
          <Button variant="secondary" className="w-full flex items-center justify-center gap-3">
            <span className="text-lg">G</span>
            Continue with Google
          </Button>
          <Button variant="secondary" className="w-full flex items-center justify-center gap-3">
            <span className="text-lg"></span>
            Continue with Apple
          </Button>
        </div>

        <p className="text-center mt-10 text-sm">
          Already have an account? <a href="/login" className="underline" style={{color:'var(--color-brand)'}}>Log in here</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;


