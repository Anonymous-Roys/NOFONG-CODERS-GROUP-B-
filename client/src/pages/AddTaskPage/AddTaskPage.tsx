// src/pages/AddTaskPage/AddTaskPage.tsx
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { ArrowLeft, Droplets, Scissors, Zap, Flower2, Calendar, AlarmClock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import TimePicker from '../../components/TimePicker';
import DatePicker from '../../components/DatePicker';
import TaskConfirmation from '../../components/TaskConfirmation';

const AddTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTaskType, setSelectedTaskType] = useState<string>('');
  const [selectedPlant, setSelectedPlant] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFrequency, setSelectedFrequency] = useState('Daily');
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const taskTypes = [
    { id: 'water', label: 'Water', icon: Droplets, color: 'text-blue-500' },
    { id: 'fertilize', label: 'Fertilize', icon: Zap, color: 'text-green-500' },
    { id: 'prune', label: 'Prune', icon: Scissors, color: 'text-red-500' },
    { id: 'repot', label: 'Repot', icon: Flower2, color: 'text-green-500' }
  ];

  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPlants();
    if (isEditing && id) {
      fetchTaskData(id);
    }
  }, [isEditing, id]);

  const fetchTaskData = async (taskId: string) => {
    try {
      const task = await apiFetch(`/api/tasks/${taskId}`);
      setSelectedTaskType(task.type);
      setSelectedPlant(task.plantId._id || task.plantId);
      setSelectedTime(task.time || '08:00');
      setSelectedDate(new Date(task.date));
      setSelectedFrequency(task.frequency || 'Daily');
      setAlarmEnabled(task.alarmEnabled ?? true);
    } catch (err) {
      console.error('Failed to fetch task data:', err);
    }
  };

  const fetchUserPlants = async () => {
    try {
      const data = await apiFetch('/api/plants');
      setPlants(data.map((plant: any) => ({
        id: plant._id,
        name: plant.name,
        imageUrl: plant.photoUrl || plant.image || '/imagetomato.jpg'
      })));
    } catch (err) {
      console.error('Failed to fetch user plants:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickTimeOptions = [
    { label: 'Morning (8 am)', time: '08:00' },
    { label: 'Afternoon (2 pm)', time: '14:00' }
  ];

  const frequencyOptions = [
    { id: 'Daily', label: 'Daily' },
    { id: 'Weekly', label: 'Weekly' },
    { id: 'Every 3 days', label: 'Every 3 days' },
    { id: 'Custom', label: 'Custom' }
  ];

  const handleNext = () => {
    if (currentStep === 1 && selectedTaskType && selectedPlant) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setShowConfirmation(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleSave = async () => {
    try {
      // Combine selected date and time
      const taskDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      taskDateTime.setHours(hours, minutes, 0, 0);

      const url = isEditing ? `/api/tasks/${id}` : '/api/tasks';
      const method = isEditing ? 'PUT' : 'POST';

      await apiFetch(url, {
        method,
        body: JSON.stringify({
          type: selectedTaskType,
          plantId: selectedPlant,
          time: selectedTime,
          date: taskDateTime.toISOString(),
          frequency: selectedFrequency,
          alarmEnabled,
          notificationEnabled: true
        })
      });
      
      setSuccessMessage(isEditing ? 'Task updated successfully!' : 'Task created successfully!');
      setTimeout(() => {
        navigate('/tasks');
      }, 2000);
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleConfirmationOk = () => {
    navigate('/');
  };

  const handleConfirmationEdit = () => {
    setShowConfirmation(false);
    setCurrentStep(2);
  };

  const handleConfirmationDelete = () => {
    navigate('/');
  };

  const isNextEnabled = () => {
    if (currentStep === 1) return selectedTaskType && selectedPlant;
    if (currentStep === 2) return true;
    if (currentStep === 3) return true;
    return false;
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return isEditing ? 'Edit Task' : 'Add New Task';
      case 2: return 'When should I remind you?';
      case 3: return 'Set Reminder';
      default: return isEditing ? 'Edit Task' : 'Add New Task';
    }
  };

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return `${dayName}, ${day} ${month}`;
  };

  const getSelectedPlantData = () => {
    return plants.find(p => p.id === selectedPlant);
  };

  const getSelectedTaskTypeData = () => {
    return taskTypes.find(t => t.id === selectedTaskType);
  };

  // Show confirmation screen
  if (showConfirmation) {
    const plantData = getSelectedPlantData();
    const taskTypeData = getSelectedTaskTypeData();
    
    if (!plantData || !taskTypeData) return null;

    return (
      <TaskConfirmation
        task={{
          type: taskTypeData.label,
          plantName: plantData.name,
          time: selectedTime,
          frequency: selectedFrequency,
          imageUrl: plantData.imageUrl
        }}
        onOk={handleConfirmationOk}
        onEdit={handleConfirmationEdit}
        onDelete={handleConfirmationDelete}
      />
    );
  }

  return (
    <div className="min-h-screen mb-16 bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-4 bg-white border-b border-gray-100">
        <button 
          onClick={handleBack}
          className="p-2 transition-colors rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-green-800">{getStepTitle()}</h1>
      </div>

      {/* Main Content */}
      <div className="p-5 pb-32 space-y-8">
        {/* Step 1: Task Type and Plant Selection */}
        {currentStep === 1 && (
          <>
            {/* What do you want to do? Section */}
            <div>
              <h2 className="mb-6 text-xl font-semibold text-green-800">What do you want to do?</h2>
              <div className="grid grid-cols-2 gap-4">
                {taskTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedTaskType(type.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        selectedTaskType === type.id
                          ? 'border-green-500 bg-green-50 scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className={`p-3 rounded-full ${
                          selectedTaskType === type.id ? 'bg-white' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-8 h-8 ${type.color}`} />
                        </div>
                        <span className="text-lg font-medium text-gray-800">{type.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Which plant? Section */}
            <div>
              <h2 className="mb-6 text-xl font-semibold text-green-800">Which plant?</h2>
              {loading ? (
                <div className="py-8 text-center">
                  <div className="w-8 h-8 mx-auto mb-4 border-4 border-green-200 rounded-full border-t-green-600 animate-spin"></div>
                  <p>Loading your plants...</p>
                </div>
              ) : plants.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="mb-4 text-gray-600">No plants found. Add plants to your garden first.</p>
                  <button 
                    onClick={() => navigate('/plants')}
                    className="text-green-600 underline"
                  >
                    Browse Plant Library
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {plants.map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => setSelectedPlant(plant.id)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                      selectedPlant === plant.id
                        ? 'bg-green-50 scale-105'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-20 h-20 rounded-full overflow-hidden border-4 transition-all duration-200 ${
                      selectedPlant === plant.id
                        ? 'border-green-500'
                        : 'border-gray-200'
                    }`}>
                      <img 
                        src={plant.imageUrl} 
                        alt={plant.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{plant.name}</span>
                  </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Step 2: Time Selection */}
        {currentStep === 2 && (
          <>
            {/* Quick Time Options */}
            <div className="space-y-4">
              <div className="flex gap-3">
                {quickTimeOptions.map((option) => (
                  <button
                    key={option.time}
                    onClick={() => setSelectedTime(option.time)}
                    className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                      selectedTime === option.time
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'border-green-200 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Time Picker */}
              <div className="flex justify-center">
                <TimePicker
                  selectedTime={selectedTime}
                  onTimeChange={setSelectedTime}
                />
              </div>

              {/* Date Selection */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-3 p-3 text-green-700 transition-colors border border-green-200 rounded-full hover:bg-green-50"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Today - {formatDate(selectedDate)}</span>
                </button>

                {showDatePicker && (
                  <DatePicker
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    className="mt-4"
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Step 3: Repeat Options and Alarm */}
        {currentStep === 3 && (
          <>
            {/* Repeat Options */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-green-800">Repeat (optional)</h3>
              <div className="space-y-3">
                {frequencyOptions.map((option) => (
                  <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value={option.id}
                      checked={selectedFrequency === option.id}
                      onChange={(e) => setSelectedFrequency(e.target.value)}
                      className="w-5 h-5 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Alarm Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <AlarmClock className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Allow alarm</span>
              </div>
              <button
                onClick={() => setAlarmEnabled(!alarmEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  alarmEnabled ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    alarmEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom Section */}
      <div className="fixed left-0 right-0 p-5 bg-white border-t border-gray-100 bottom-24">
        {/* Action Button */}
        <Button 
          onClick={currentStep === 3 ? handleSave : handleNext}
          disabled={!isNextEnabled()}
          variant="primary" 
          className={`w-full py-4 text-lg font-semibold transition-all duration-200 ${
            isNextEnabled() 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {currentStep === 3 ? 'Save' : 'Next'}
        </Button>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-colors ${
                step === currentStep ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{successMessage}</h3>
            <p className="text-gray-600">Redirecting to tasks...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTaskPage;
