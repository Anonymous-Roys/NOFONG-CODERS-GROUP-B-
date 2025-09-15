import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { apiFetch } from '../../utils/api';

interface Plant {
  _id: string;
  name: string;
  species: string;
  photoUrl?: string;
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
  plants: Plant[];
}

const GardenDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [garden, setGarden] = useState<Garden | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchGarden();
    }
  }, [id]);

  const fetchGarden = async () => {
    try {
      const data = await apiFetch(`/api/gardens/${id}`);
      setGarden(data);
    } catch (err) {
      console.error('Failed to fetch garden:', err);
      navigate('/garden');
    } finally {
      setLoading(false);
    }
  };

  const getCareIcon = (status: string, type: 'light' | 'water' | 'mood') => {
    const icons = {
      light: { good: '☀️', warning: '🌤️', critical: '🌑' },
      water: { good: '💧', warning: '💧', critical: '🚱' },
      mood: { happy: '😊', neutral: '😐', sad: '😢' }
    };
    return icons[type][status as keyof typeof icons[typeof type]] || '❓';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-green-200 rounded-full border-t-green-600 animate-spin"></div>
      </div>
    );
  }

  if (!garden) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Garden not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{backgroundColor: 'var(--color-white)'}}>
      <div className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => navigate('/garden')}>
          <ArrowLeft className="w-6 h-6" style={{color:'var(--color-text-strong)'}} />
        </button>
        <h1 className="text-xl font-semibold" style={{color:'var(--color-text-strong)'}}>{garden.name}</h1>
      </div>

      <div className="px-5">
        {garden.plants.length === 0 ? (
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{backgroundColor:'var(--color-light-green)'}}>
              <span className="text-2xl">🌱</span>
            </div>
            <h2 className="mb-2 text-xl font-semibold" style={{color:'var(--color-text-strong)'}}>No plants in this garden</h2>
            <p className="mb-6" style={{color:'var(--color-medium-gray)'}}>Add your first plant to get started!</p>
            <Button onClick={() => navigate('/plants', { state: { gardenId: garden._id } })}>
              Add Plant
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {garden.plants.map((plant) => (
              <div 
                key={plant._id}
                onClick={() => navigate(`/plants/${plant._id}`)}
                className="flex items-center gap-4 p-4 bg-white border cursor-pointer rounded-2xl"
                style={{borderColor:'var(--color-border-gray)'}}
              >
                <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-xl" style={{backgroundColor:'var(--color-light-gray)'}}>
                  {plant.photoUrl ? (
                    <img src={plant.photoUrl} alt={plant.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <span className="text-2xl">🌿</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold" style={{color:'var(--color-text-strong)'}}>{plant.name}</h3>
                  <p className="text-sm" style={{color:'var(--color-medium-gray)'}}>{plant.species || 'Cactus'}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <span>{getCareIcon(plant.careStatus.light, 'light')}</span>
                      <span className="text-xs">Light</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{getCareIcon(plant.careStatus.water, 'water')}</span>
                      <span className="text-xs">Water</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{getCareIcon(plant.careStatus.mood, 'mood')}</span>
                      <span className="text-xs">{plant.careStatus.mood === 'happy' ? 'Happy' : plant.careStatus.mood === 'neutral' ? 'Neutral' : 'Angry'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {garden.plants.length > 0 && (
        <div className="fixed left-0 right-0 px-5 bottom-24">
          <Button 
            onClick={() => navigate('/plants/add', { state: { gardenId: garden._id } })}
            className="w-full" 
          >
            Add New Plant
          </Button>
        </div>
      )}
    </div>
  );
};

export default GardenDetailPage;