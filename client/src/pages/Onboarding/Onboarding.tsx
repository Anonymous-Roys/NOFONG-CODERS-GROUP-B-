import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    title: 'Welcome to App name',
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

  const finishTo = (path: '/login' | '/signup') => {
    localStorage.setItem('onboarded', 'true');
    navigate(path);
  };

  const skip = () => finishTo('/login');

  const slide = slides[current];

  return (
    <div className="min-h-screen flex flex-col px-4 pt-8 pb-6 bg-white">
      <div className="rounded-3xl bg-primary-200 p-4 mx-auto w-full max-w-sm">
        <img src={slide.image} alt="Onboarding visual" className="w-full h-auto rounded-2xl object-cover" />
      </div>

      <div className="mt-8 max-w-sm mx-auto w-full">
        <h1 className="text-3xl font-extrabold text-brand">{slide.title}</h1>
        <p className="mt-3 font-semibold text-gray-800">{slide.subtitle}</p>
        <p className="mt-2 text-gray-600">{slide.body}</p>

        <div className="mt-8 flex items-center justify-center gap-2" aria-label="Onboarding progress">
          {slides.map((_, i) => (
            <Indicator key={i} index={i} current={current} />
          ))}
        </div>

        {current < slides.length - 1 ? (
          <div className="mt-8 flex items-center justify-between">
            {current > 0 ? (
              <Button variant="ghost" size="md" onClick={prev}>Back</Button>
            ) : (
              <span />
            )}
            <Button variant="primary" size="md" onClick={next}>Next</Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-3">
            <Button variant="primary" size="lg" onClick={() => finishTo('/signup')}>{slide.cta ?? 'Begin your journey'}</Button>
            <Button variant="outline" size="md" onClick={() => finishTo('/login')}>Log in</Button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between text-gray-600">
          <button className="underline" onClick={skip}>Skip</button>
          <span>
            Already have an account?{' '}
            <Link className="text-brand font-semibold underline" to="/login">Log in here</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;


