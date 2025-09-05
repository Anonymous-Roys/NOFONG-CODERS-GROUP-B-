// src/pages/AddTaskPage/AddTaskPage.tsx
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Droplets, Scissors, Zap } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';

const AddTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    plantName: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  const taskTypes = [
    { id: 'water', label: 'Water', icon: Droplets, color: 'text-blue-600' },
    { id: 'prune', label: 'Prune', icon: Scissors, color: 'text-green-600' },
    { id: 'fertilize', label: 'Fertilize', icon: Zap, color: 'text-yellow-600' },
    { id: 'repot', label: 'Repot', icon: Calendar, color: 'text-purple-600' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding task:', formData);
    // Here you would typically save the task data
    navigate('/');
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
        <h1 className="text-xl font-semibold text-primary-800">Add New Task</h1>
      </div>

      {/* Main Content */}
      <div className="p-5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Type */}
          <div className="card">
            <h3 className="font-medium text-gray-800 mb-4">Task Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {taskTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleInputChange('type', type.id)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      formData.type === type.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon className={`w-6 h-6 ${type.color}`} />
                      <span className="text-sm font-medium text-gray-800">{type.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Task Details */}
          <div className="card">
            <h3 className="font-medium text-gray-800 mb-4">Task Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Name *
                </label>
                <Input
                  placeholder="e.g., My Peace Lily"
                  value={formData.plantName}
                  onChange={(e) => handleInputChange('plantName', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Add any specific instructions or notes..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
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
              Add Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPage;
