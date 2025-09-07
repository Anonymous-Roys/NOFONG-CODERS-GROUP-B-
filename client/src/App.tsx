// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import GardenPage from './pages/GardenPage/GardenPage';
import PlantsPage from './pages/PlantsPage/PlantsPage';
import JournalPage from './pages/JournalPage/JournalPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AddPlantPage from './pages/AddPlantPage/AddPlantPage';
import AddTaskPage from './pages/AddTaskPage/AddTaskPage';
import HomePage from './pages/Homepage/Homepage';
import './styles/design-system.css'
import './styles/base.css';
import './styles/components.css';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="garden" element={<GardenPage />} />
          <Route path="plants" element={<PlantsPage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="plants/add" element={<AddPlantPage />} />
          <Route path="tasks/add" element={<AddTaskPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;