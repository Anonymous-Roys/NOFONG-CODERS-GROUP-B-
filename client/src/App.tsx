// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import GardenPage from './pages/GardenPage/GardenPage';
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
import './styles/design-system.css'
import './styles/base.css';
import './styles/components.css';
import { AuthProvider } from './context/AuthContext';
import SignupPage from './pages/SignupPage/SignupPage';
import ProfileCreatePage from './pages/ProfileCreatePage/ProfileCreatePage';



function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* <Route path="" element={<DesignSystemShowcase/>} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile/create" element={<ProfileCreatePage />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="garden" element={<GardenPage />} />
          <Route path="plants" element={<PlantsPage />} />
          <Route path="plants/:slug" element={<PlantDetailPage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="plants/add" element={<AddPlantPage />} />
          <Route path="tasks/add" element={<AddTaskPage />} />
          <Route path="tasks" element={<TaskManager />} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;