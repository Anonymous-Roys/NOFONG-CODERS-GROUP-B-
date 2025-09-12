import React, { useState } from 'react';
import { Button } from '../../components/ui/Button/Button';
import OTPInput from '../../components/ui/Input/OTPInput';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input/Input';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const { verifyOtp, completeProfile, loading, error: authError, clearError } = useAuth();
  const [error, setError] = useState<string>('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState('');
  const [step, setStep] = useState<'otp' | 'profile'>('otp');
  const navigate = useNavigate();

  const handleComplete = async (code: string) => {
    setError('');
    clearError();
    
    const result = await verifyOtp(code);
    if (result === 'invalid') {
      setError(authError || 'Invalid code. Try the code you received.');
    } else if (result === 'profile_pending') {
      setStep('profile');
    } else {
      navigate('/');
    }
  };

  const handleProfileSubmit = async () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    const result = await completeProfile({
      name: username,
      dob,
      location
    });
    
    if (result.success) {
      navigate('/');
    }
  };

  React.useEffect(() => {
    // If we landed here from Login Register link, OTP is already sent with purpose=register
    // If user typed /signup directly, do nothing until they enter OTP code delivered earlier
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen px-4" style={{backgroundColor: 'var(--color-white)'}}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{backgroundColor:'var(--color-light-green)'}}>
            <span style={{color:'var(--color-brand)'}}>🌱</span>
          </div>
          <h1 className="text-2xl font-semibold" style={{fontFamily:'var(--font-family-heading)', color:'var(--color-text-strong)'}}>Create Your Account</h1>
        </div>

        {step === 'otp' ? (
          <>
            <div className="mb-3" style={{color:'var(--color-text-strong)'}}>Enter OTP</div>
            <OTPInput length={6} onComplete={handleComplete} />
            {(error || authError) && <p className="mt-2 text-sm" style={{color:'#dc2626'}}>{error || authError}</p>}
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 mt-6">
              <Input 
                label="Username" 
                placeholder="Choose a username" 
                value={username} 
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                  clearError();
                }} 
                required
              />
              <Input label="Date of Birth" type="date" value={dob} onChange={(e)=>setDob(e.target.value)} />
              <Input label="Location" placeholder="City, Country" value={location} onChange={(e)=>setLocation(e.target.value)} />
            </div>
            
            {(error || authError) && <p className="mt-2 text-sm" style={{color:'#dc2626'}}>{error || authError}</p>}
            
            <Button 
              className="w-full mt-4" 
              onClick={handleProfileSubmit}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          </>
        )}

        <div className="flex items-center gap-4 my-6">
          <hr className="flex-1 border-t" style={{borderColor:'var(--color-border-gray)'}} />
          <span className="text-sm" style={{color:'var(--color-medium-gray)'}}>Sign up with</span>
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

        <p className="mt-10 text-sm text-center">
          Already have an account? <a href="/login" className="underline" style={{color:'var(--color-brand)'}}>Log in here</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;


