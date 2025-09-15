import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plantName?: string;
  plantSpecies?: string;
  plantId?: string;
  plantImageUrl?: string;
  plantDescription?: string;
  plantformerId?: string;
  
}

interface Garden {
  _id: string;
  name: string;
  location: string;
}

const AddPlantModal: React.FC<AddPlantModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  plantName = 'Plant',
  plantSpecies = '',
  plantId = '',
  plantImageUrl = ''
}) => {
  const [customName, setCustomName] = useState('');
  const [selectedGarden, setSelectedGarden] = useState('');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchGardens();
    }
  }, [isOpen]);

  const fetchGardens = async () => {
    try {
      const data = await apiFetch('/api/gardens');
      setGardens(data);
      if (data.length > 0) {
        setSelectedGarden(data[0]._id);
      } else {
        setError('No gardens found. Please create a garden first.');
      }
    } catch (err) {
      console.error('Failed to fetch gardens:', err);
      setError('Failed to load gardens. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!customName.trim() || !selectedGarden) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiFetch('/api/plants', {
        method: 'POST',
        body: JSON.stringify({
          name: customName.trim(),
          species: plantSpecies || plantName,
          libraryPlantId: plantId,
          photoUrl: plantImageUrl || '/1.png',
          gardenId: selectedGarden,
          notes: `Added from plant library: ${plantName}`
        })
      });

      setShowSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setShowSuccess(false);
        setCustomName('');
        setSelectedGarden('');
        setError('');
      }, 2000);
    } catch (err: any) {
      console.error('Failed to add plant:', err);
      setError(err.message || 'Failed to add plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl">
        {showSuccess ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Plant Added</h3>
            <p className="text-gray-600">Your plant has been successfully added to your garden!</p>
          </div>
        ) : (
          /* Add Plant Form */
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Add New Plant</h2>
              <button
                onClick={onClose}
                className="p-2 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Plant Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Plant Name
                </label>
                <input
                  type="text"
                  placeholder="Give your plant a special name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Assign to Garden */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Assign to Garden
                </label>
                <div className="relative">
                  <select
                    value={selectedGarden}
                    onChange={(e) => setSelectedGarden(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 appearance-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="">Select a garden</option>
                    {gardens.map((garden) => (
                      <option key={garden._id} value={garden._id}>
                        {garden.name} ({garden.location})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Reminders Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Reminders</span>
                <button
                  onClick={() => setRemindersEnabled(!remindersEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    remindersEnabled ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      remindersEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-center text-red-600">
                  {error}
                  {error.includes('No gardens found') && (
                    <div className="mt-2">
                      <button
                        onClick={() => {
                          onClose();
                          navigate('/garden');
                        }}
                        className="text-sm text-green-600 underline"
                      >
                        Create a garden first
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={loading || !customName.trim() || !selectedGarden}
                className="w-full py-3 font-medium text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Plant...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPlantModal;