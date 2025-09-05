// src/pages/AddPlantPage/AddPlantPage.tsx
import React, { useState } from 'react';
import { ArrowLeft, Camera, MapPin, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';

const AddPlantPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    location: '',
    purchaseDate: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding plant:', formData);
    // Here you would typically save the plant data
    navigate('/garden');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center gap-4 border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-primary-800">Add New Plant</h1>
      </div>

      {/* Main Content */}
      <div className="p-5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plant Photo */}
          <div className="card">
            <h3 className="font-medium text-gray-800 mb-4">Plant Photo</h3>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Add a photo of your plant</p>
                <Button variant="outline" size="sm">
                  Choose Photo
                </Button>
              </div>
            </div>
          </div>

          {/* Plant Information */}
          <div className="card">
            <h3 className="font-medium text-gray-800 mb-4">Plant Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Name *
                </label>
                <Input
                  placeholder="e.g., My Peace Lily"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Species/Variety
                </label>
                <Input
                  placeholder="e.g., Spathiphyllum wallisii"
                  value={formData.species}
                  onChange={(e) => handleInputChange('species', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    placeholder="e.g., Living Room, Kitchen"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                    className="pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  placeholder="Any special care instructions or notes..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              type="button"
              variant="outline" 
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary" 
              className="flex-1"
            >
              Add Plant
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlantPage;
