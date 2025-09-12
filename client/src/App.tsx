// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import GardenPage from './pages/GardenPage/GardenPage';
import GardenDetailPage from './pages/GardenDetailPage/GardenDetailPage';
import PlantsPage from './pages/PlantsPage/PlantsPage';
import JournalPage from './pages/JournalPage/JournalPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AddPlantPage from './pages/AddPlantPage/AddPlantPage';
import AddTaskPage from './pages/AddTaskPage/AddTaskPage';
import { TaskManager } from './pages/TaskManager/TaskManager';
import HomePage from './pages/Homepage/Homepage';
import PlantDetailPage from './pages/PlantDetailPage/PlantDetailPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SplashScreen from './components/SplashScreen';
import Onboarding from './pages/Onboarding/Onboarding';
import './styles/design-system.css'
import './styles/base.css';
import './styles/components.css';
import { AuthProvider } from './context/AuthContext';
import SignupPage from './pages/SignupPage/SignupPage';
import ProfileCreatePage from './pages/ProfileCreatePage/ProfileCreatePage';
import OtpPage from './pages/OtpPage/OtpPage';
import { RequireAuth, PublicOnly } from './routes/guards';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [shouldOnboard, setShouldOnboard] = useState<boolean | null>(null);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    const onboarded = localStorage.getItem('onboarded') === 'true';
    setShouldOnboard(!onboarded);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (shouldOnboard) {
    return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<Onboarding />} />
          </Routes>
        </Router>
      </AuthProvider>
    );
  }

  return (
    <>
      <div className="desktop-warning">
        <div className="warning-content">
          <h2>📱 Mobile Experience Only</h2>
          <p>This gardening app is designed for mobile and tablet devices.</p>
          <p>Please access it from your phone or tablet for the best experience.</p>
        </div>
      </div>
      <div className="mobile-app">
        <AuthProvider>
          <Router>
            <Routes>
              <Route element={<PublicOnly />}>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/otp" element={<OtpPage />} />
                <Route path="/profile/create" element={<ProfileCreatePage />} />
              </Route>
              <Route element={<RequireAuth />}>
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="garden" element={<GardenPage />} />
                  <Route path="garden/:id" element={<GardenDetailPage />} />
                  <Route path="plants" element={<PlantsPage />} />
                  <Route path="plants/:slug" element={<PlantDetailPage />} />
                  <Route path="journal" element={<JournalPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="plants/add" element={<AddPlantPage />} />
                  <Route path="tasks/add" element={<AddTaskPage />} />
                  <Route path="tasks" element={<TaskManager />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;