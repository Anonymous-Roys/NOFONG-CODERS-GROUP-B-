import React, { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Bell } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import CreateGardenModal from '../../components/ui/CreateGardenModal';

interface Plant {
  _id: string;
  name: string;
  species: string;
  photoUrl?: string;
  image?: string; // base64 image string
  careStatus: {
    light: 'good' | 'warning' | 'critical';
    water: 'good' | 'warning' | 'critical';
    mood: 'happy' | 'neutral' | 'sad';
  };
}

interface Garden {
  _id: string;
  name: string;
  location: string;
  plantCount: number;
  taskCount: number;
  plants: Plant[];
}

const GardenPage: React.FC = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGardens();
  }, []);

  const fetchGardens = async () => {
    try {
      const data = await apiFetch('/api/gardens');
      setGardens(data);
    } catch (err) {
      console.error('Failed to fetch gardens:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGardens = gardens.filter(garden =>
    garden.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

 

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-green-200 rounded-full border-t-green-600 animate-spin"></div>
          <p>Loading your gardens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{backgroundColor: 'var(--color-white)'}}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h1 className="text-xl font-semibold" style={{color:'var(--color-text-strong)'}}>My Garden</h1>
        <Bell className="w-6 h-6" style={{color:'var(--color-text-strong)'}} />
      </div>

      {/* Search Bar */}
      <div className="px-5 mb-4">
        <div className="relative">
          <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2" style={{color:'var(--color-medium-gray)'}} />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <button 
            onClick={() => setShowCreateModal(true)}
            className="absolute text-sm underline transform -translate-y-1/2 right-3 top-1/2"
            style={{color:'var(--color-brand)'}}
          >
            New Garden
          </button>
        </div>
      </div>

      {/* Gardens List */}
      <div className="px-5 space-y-4">
        {filteredGardens.length === 0 ? (
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{backgroundColor:'var(--color-light-green)'}}>
              <span className="text-2xl">🌱</span>
            </div>
            <h2 className="mb-2 text-xl font-semibold" style={{color:'var(--color-text-strong)'}}>No gardens yet</h2>
            <p className="mb-6" style={{color:'var(--color-medium-gray)'}}>Create your first garden to start organizing your plants!</p>
            <Button onClick={() => setShowCreateModal(true)}>Create Garden</Button>
          </div>
        ) : (
          filteredGardens.map((garden) => (
            <GardenCard 
              key={garden._id} 
              garden={garden} 
              onPress={() => navigate(`/garden/${garden._id}`)} 
            />
          ))
        )}
      </div>

      {/* Create Garden Modal */}
      {showCreateModal && (
        <CreateGardenModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchGardens();
          }}
        />
      )}
    </div>
  );
};

const GardenCard: React.FC<{ garden: Garden; onPress: () => void }> = ({ garden, onPress }) => {
  return (
    <div 
      onClick={onPress}
      className="p-4 bg-white border cursor-pointer rounded-2xl"
      style={{borderColor:'var(--color-border-gray)'}}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{backgroundColor:'var(--color-brand)'}}>
            <span className="text-sm text-white">🏠</span>
          </div>
          <h3 className="font-semibold" style={{color:'var(--color-text-strong)'}}>{garden.name}</h3>
        </div>
        <MoreHorizontal className="w-5 h-5" style={{color:'var(--color-medium-gray)'}} />
      </div>
      
      <p className="mb-4 text-sm" style={{color:'var(--color-medium-gray)'}}>
        {garden.plantCount} plants • {garden.taskCount} task{garden.taskCount !== 1 ? 's' : ''}
      </p>
      
      <div className="grid grid-cols-4 gap-2">
        {garden.plants.slice(0, 4).map((plant) => (
          <div key={plant._id} className="overflow-hidden rounded-lg aspect-square" style={{backgroundColor:'var(--color-light-gray)'}}>
            {plant.photoUrl ? (
              <img src={plant.photoUrl} alt={plant.name} className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-2xl">🌿</span>
              </div>
            )}
          </div>
        ))}
        {Array.from({ length: Math.max(0, 4 - garden.plants.length) }).map((_, index) => (
          <div key={`empty-${index}`} className="rounded-lg aspect-square" style={{backgroundColor:'var(--color-light-gray)'}} />
        ))}
      </div>
    </div>
  );
};



export default GardenPage;
