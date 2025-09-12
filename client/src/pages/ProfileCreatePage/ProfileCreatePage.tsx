import React, { useState } from 'react';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileCreatePage: React.FC = () => {
  const { completeProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Username is required';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (dob && Number.isNaN(Date.parse(dob))) e.dob = 'Enter a valid date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await completeProfile({ name, email: email || undefined, dob: dob || undefined, location: location || undefined });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{backgroundColor: 'var(--color-white)'}}>
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6" style={{fontFamily:'var(--font-family-heading)', color:'var(--color-text-strong)'}}>Create Your Profile</h1>
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img alt="avatar" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" className="w-24 h-24 rounded-full object-cover" />
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-white" style={{backgroundColor:'var(--color-brand)'}}>✎</button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Username" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required endIcon={<span>👤</span>} />
          <Input label="Email (Optional)" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} endIcon={<span>✉️</span>} />
          <div>
            <label className="block mb-2 text-sm" style={{color:'var(--color-text-strong)'}}>Date of Birth</label>
            <div className="relative">
              <input type="date" value={dob} onChange={(e)=>setDob(e.target.value)} className="w-full pr-12 pl-5 py-3 text-lg border-2 rounded-full focus:outline-none focus:ring-4 focus:ring-primary-400" style={{borderColor:'var(--color-border-gray)'}} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">📅</span>
            </div>
            {errors.dob && <p className="mt-1 text-sm" style={{color:'#dc2626'}}>{errors.dob}</p>}
          </div>
          <Input label="Location (Optional)" placeholder="Tarkwa, Ghana" value={location} onChange={(e) => setLocation(e.target.value)} endIcon={<span>📍</span>} />

          <Button type="submit" className="w-full">Complete</Button>
        </form>

      </div>
    </div>
  );
};

export default ProfileCreatePage;


