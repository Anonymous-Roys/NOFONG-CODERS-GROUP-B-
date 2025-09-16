import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { Button } from '../../components/ui/Button/Button';

type Slide = {
  title: string;
  subtitle: string;
  body: string;
  image: string;
  cta?: string;
};

const slides: Slide[] = [
  {
    title: 'Welcome to Bloom Buddy',
    subtitle: 'Your Personal Gardening Helper',
    body: 'Track your plants, get reminders, and keep your garden thriving with ease.',
    image: '1.png',
  },
  {
    title: 'Simple Care Reminders',
    subtitle: 'Never Forget to Care',
    body: 'We\'ll remind you when to water, feed, or move your plants to sunlight, so you can relax and enjoy.',
    image: '2.png',
  },
  {
    title: 'Learn & Explore',
    subtitle: 'Grow Smarter, Not Harder',
    body: 'Discover plant tips, common problems, and easy fixes, all explained in simple words.',
    image: '3.png',
    cta: 'Begin your journey',
  },
];

const Indicator: React.FC<{ index: number; current: number }> = ({ index, current }) => {
  const isActive = index === current;
  return (
    <span
      aria-hidden
      className={[
        'inline-block h-2 rounded-full transition-all',
        isActive ? 'w-8 bg-brand' : 'w-2 bg-primary-300',
      ].join(' ')}
    />
  );
};

const Onboarding: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => setCurrent((c) => Math.min(c + 1, slides.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  const handleBeginJourney = () => {
    localStorage.setItem('onboarded', 'true');
    navigate('/signup');
  };

  const handleLogin = () => {
    localStorage.setItem('onboarded', 'true');
    navigate('/login');
  };

  const handleSkip = () => {
    localStorage.setItem('onboarded', 'true');
    navigate('/login');
  };

  const slide = slides[current];

  return (
    <div className="flex flex-col min-h-screen px-4 pt-8 pb-6 bg-white">
      <div className="w-full max-w-sm p-4 mx-auto rounded-3xl bg-primary-200">
        <img src={slide.image} alt="Onboarding visual" className="object-cover w-full h-auto rounded-2xl" />
      </div>

      <div className="w-full max-w-sm mx-auto mt-8">
        <h1 className="text-3xl font-extrabold text-brand">{slide.title}</h1>
        <p className="mt-3 font-semibold text-gray-800">{slide.subtitle}</p>
        <p className="mt-2 text-gray-600">{slide.body}</p>

        <div className="flex items-center justify-center gap-2 mt-8" aria-label="Onboarding progress">
          {slides.map((_, i) => (
            <Indicator key={i} index={i} current={current} />
          ))}
        </div>

        {current < slides.length - 1 ? (
          <div className="flex items-center justify-between mt-8">
            {current > 0 ? (
              <Button variant="ghost" size="md" onClick={prev}>Back</Button>
            ) : (
              <span />
            )}
            <Button variant="primary" size="md" onClick={next}>Next</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 mt-8">
            <Button variant="primary" size="lg" onClick={handleBeginJourney}>{slide.cta ?? 'Begin your journey'}</Button>
            <Button variant="outline" size="md" onClick={handleLogin}>Log in</Button>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 text-gray-600">
          <button className="underline" onClick={handleSkip}>Skip</button>
          <span>
            Already have an account?{' '}
            <button className="font-semibold underline text-brand" onClick={handleLogin}>Log in here</button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;


