import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import type { CareTask, Plant, TaskType } from '../../types';
import { usePlants } from '../../hooks/usePlants';
import { useNavigate } from 'react-router-dom';

// Mock task data
const mockTasks: CareTask[] = [
  {
    id: '1',
    plantId: '1',
    type: 'water',
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    completed: false,
    isLate: true,
    daysLate: 1,
  },
  {
    id: '2',
    plantId: '2',
    type: 'water',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    completed: false,
  },
  {
    id: '3',
    plantId: '1',
    type: 'prune',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    completed: false,
  },
  {
    id: '4',
    plantId: '2',
    type: 'repot',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    completed: false,
  },
];

const taskTypes: TaskType[] = [
  { id: 'water', label: 'Water', icon: '💧' },
  { id: 'fertilize', label: 'Fertilize', icon: '🌱' },
  { id: 'prune', label: 'Prune', icon: '✂️' },
  { id: 'repot', label: 'Repot', icon: '🌿' },
];

interface TaskCardProps {
  task: CareTask;
  plant: Plant;
  onComplete: (taskId: string) => void;
  onSnooze: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, plant, onComplete, onSnooze }) => {
  const taskType = taskTypes.find(t => t.id === task.type);
  const timeString = task.dueDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-100">
      <div className="flex items-start space-x-4">
        {/* Plant Image */}
        <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
          {plant.imageUrl ? (
            <img 
              src={plant.imageUrl} 
              alt={plant.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl">🌿</span>
          )}
        </div>

        {/* Task Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                {plant.name} - {taskType?.label}
              </h3>
              <p className="text-gray-600">Time: {timeString}</p>
            </div>
            <button className="text-green-600 hover:text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>

          {/* Late Badge */}
          {task.isLate && task.daysLate && (
            <div className="mt-2">
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                {task.daysLate === 1 ? 'One day late' : `${task.daysLate} days late`}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center mt-4 space-x-4">
            <button 
              onClick={() => onComplete(task.id)}
              className="flex items-center space-x-2 text-green-600 hover:text-green-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Done</span>
            </button>
            
            <div className="w-px h-4 bg-gray-300"></div>
            
            <button 
              onClick={() => onSnooze(task.id)}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Snooze</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TaskTypeSelectorProps {
  selectedType: string | null;
  onSelectType: (type: string) => void;
}

const TaskTypeSelector: React.FC<TaskTypeSelectorProps> = ({ selectedType, onSelectType }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-green-600 font-semibold text-lg">What do you want to do?</h2>
      <div className="grid grid-cols-2 gap-4">
        {taskTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelectType(type.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedType === type.id
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="font-medium text-gray-800">{type.label}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

interface PlantSelectorProps {
  plants: Plant[];
  selectedPlant: string | null;
  onSelectPlant: (plantId: string) => void;
}

const PlantSelector: React.FC<PlantSelectorProps> = ({ plants, selectedPlant, onSelectPlant }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-green-600 font-semibold text-lg">Which plant?</h2>
      <div className="grid grid-cols-3 gap-4">
        {plants.map((plant) => (
          <button
            key={plant.id}
            onClick={() => onSelectPlant(plant.id)}
            className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-all ${
              selectedPlant === plant.id
                ? 'bg-green-100 border-2 border-green-400'
                : 'bg-white border-2 border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center">
              {plant.imageUrl ? (
                <img 
                  src={plant.imageUrl} 
                  alt={plant.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl">🌿</span>
              )}
            </div>
            <span className="text-sm font-medium text-gray-800">{plant.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

interface TaskManagerProps {
  onBack?: () => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { plants, loading } = usePlants();
  const [tasks, setTasks] = useState<CareTask[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await apiFetch('/api/tasks');
      setTasks(data.map((task: any) => ({
        id: task._id,
        plantId: task.plantId?._id || task.plantId,
        type: task.type,
        dueDate: new Date(task.date),
        completed: task.completed,
        isLate: new Date(task.date) < new Date() && !task.completed,
        daysLate: new Date(task.date) < new Date() ? Math.floor((Date.now() - new Date(task.date).getTime()) / (1000 * 60 * 60 * 24)) : undefined
      })));
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };
  const [currentView, setCurrentView] = useState<'tasks' | 'newTask'>('tasks');
  const [selectedTaskType, setSelectedTaskType] = useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);

  // Separate tasks into today and upcoming
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime() && !task.completed;
  });

  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() > today.getTime() && !task.completed;
  });

  const handleCompleteTask = async (taskId: string) => {
    try {
      await apiFetch(`/api/tasks/${taskId}/complete`, { method: 'PATCH' });
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const handleSnoozeTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId 
          ? { 
              ...task, 
              dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Snooze for 1 day
              isLate: false,
              daysLate: undefined
            } 
          : task
      )
    );
  };

  const handleAddNewTask = () => {
    setCurrentView('newTask');
    setSelectedTaskType(null);
    setSelectedPlant(null);
  };

  const handleNext = async () => {
    if (selectedTaskType && selectedPlant) {
      try {
        const newTask = await apiFetch('/api/tasks', {
          method: 'POST',
          body: JSON.stringify({
            type: selectedTaskType,
            plantId: selectedPlant,
            time: '08:00',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000),
            frequency: 'Daily',
            alarmEnabled: true,
            notificationEnabled: true
          })
        });
        fetchTasks();
        setCurrentView('tasks');
      } catch (err) {
        console.error('Failed to create task:', err);
      }
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setCurrentView('tasks');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'newTask') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">New task form</h1>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          <TaskTypeSelector 
            selectedType={selectedTaskType}
            onSelectType={setSelectedTaskType}
          />
          
          <PlantSelector 
            plants={plants}
            selectedPlant={selectedPlant}
            onSelectPlant={setSelectedPlant}
          />
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-200">
          <button
            onClick={handleNext}
            disabled={!selectedTaskType || !selectedPlant}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
          
          {/* Pagination dots */}
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack || (() => navigate(-1))}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-green-600">Tasks</h1>
          <div className="w-6"></div>
        </div>
        <div className="border-b-2 border-blue-500 mx-4"></div>
      </div>

      {/* Banner */}
      <div className="bg-green-100 mx-4 mt-4 rounded-lg p-4">
        <p className="text-center text-gray-700 font-medium">Manage all your tasks</p>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Today Section */}
        <div className="mb-8">
          <h2 className="text-green-600 font-bold text-xl mb-4">Today</h2>
          {todayTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks for today</p>
          ) : (
            todayTasks.map(task => {
              const plant = plants.find(p => p.id === task.plantId);
              if (!plant) return null;
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  plant={plant}
                  onComplete={handleCompleteTask}
                  onSnooze={handleSnoozeTask}
                />
              );
            })
          )}
        </div>

        {/* Upcoming Section */}
        <div className="mb-20">
          <h2 className="text-green-600 font-bold text-xl mb-4">Upcoming</h2>
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming tasks</p>
          ) : (
            upcomingTasks.map(task => {
              const plant = plants.find(p => p.id === task.plantId);
              if (!plant) return null;
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  plant={plant}
                  onComplete={handleCompleteTask}
                  onSnooze={handleSnoozeTask}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Add New Task Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <button
          onClick={handleAddNewTask}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
        >
          Add New Task
        </button>
      </div>
    </div>
  );
};
