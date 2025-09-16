// src/pages/HomePage/HomePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';
import AddPlantModal from '../../components/ui/AddPlantModal';
import { 
  Search, 
  Plus, 
  Menu, 
  Bell, 
  Book, 
  User, 
  PenTool,
  Scissors,
  Clock,
  CheckCircle,
  ChevronRight,
  Sprout,
  ClipboardCheck,
  X,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';


interface Task {
  id: string;
  type: string;
  plantName: string;
  location: string;
  isCompleted: boolean;
  imageUrl: string;
  description: string;
  dueDate: Date;
}

interface PopularPlant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [popularPlants, setPopularPlants] = useState<PopularPlant[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PopularPlant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Calculate completed tasks count
  const todayTasksCompleted = tasks.filter(task => task.isCompleted).length;
  const totalTodayTasks = tasks.length;

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiFetch('/api/tasks');
      const allTasks = data.map((task: any) => ({
        id: task._id,
        type: task.type,
        plantName: task.plantId?.name || 'Unknown Plant',
        location: task.plantId?.location || 'Garden',
        isCompleted: task.completed,
        imageUrl: task.plantId?.photoUrl || task.plantId?.image || '/default-plant.jpg',
        description: `Click to learn how to ${task.type}`,
        dueDate: new Date(task.date)
      }));
      
      // Show due and upcoming tasks (max 2) on homepage
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const relevantTasks = allTasks
        .filter((task: any) => !task.isCompleted && task.dueDate >= today)
        .sort((a: any, b: any) => a.dueDate.getTime() - b.dueDate.getTime())
        .slice(0, 2);
      
      setTasks(relevantTasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch popular plants
  const fetchPopularPlants = useCallback(async () => {
    try {
      const data = await apiFetch('/api/plant-library?limit=4');
      setPopularPlants(data.slice(0, 4).map((plant: any) => ({
        id: plant._id,
        name: plant.name,
        description: plant.description,
        imageUrl: plant.image || '/default-plant.jpg'
      })));
    } catch (err) {
      console.error('Failed to fetch popular plants:', err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchPopularPlants();
    generateNotifications();
  }, [fetchTasks, fetchPopularPlants]);

  const generateNotifications = () => {
    const now = new Date();
    const notifs = [];
    
    // Task reminders
    const dueTasks = tasks.filter(task => {
      const taskTime = new Date(task.dueDate);
      const timeDiff = taskTime.getTime() - now.getTime();
      return !task.isCompleted && timeDiff > 0 && timeDiff <= 2 * 60 * 60 * 1000; // Next 2 hours
    });
    
    dueTasks.forEach(task => {
      const timeUntil = Math.ceil((new Date(task.dueDate).getTime() - now.getTime()) / (60 * 1000));
      notifs.push({
        id: `task-${task.id}`,
        type: 'reminder',
        title: 'Task Reminder',
        message: `${task.type} your ${task.plantName} in ${timeUntil} minutes`,
        color: 'green'
      });
    });
    
    // Overdue tasks
    const overdueTasks = tasks.filter(task => 
      !task.isCompleted && new Date(task.dueDate) < now
    );
    
    if (overdueTasks.length > 0) {
      notifs.push({
        id: 'overdue',
        type: 'warning',
        title: 'Overdue Tasks',
        message: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
        color: 'red'
      });
    }
    
    // Completion celebration
    const completedToday = tasks.filter(task => task.isCompleted).length;
    if (completedToday > 0) {
      notifs.push({
        id: 'completed',
        type: 'success',
        title: 'Great Job!',
        message: `You've completed ${completedToday} task${completedToday > 1 ? 's' : ''} today`,
        color: 'blue'
      });
    }
    
    setNotifications(notifs.slice(0, 3)); // Show max 3 notifications
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      await apiFetch(`/api/tasks/${taskId}/complete`, { method: 'PATCH' });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, isCompleted: true } : task
      ));
      
      // Play completion sound
      const audio = new Audio('/completed-sound.wav');
      audio.play().catch(() => {});
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const handleAddPlant = (plant: PopularPlant) => {
    setSelectedPlant(plant);
    setShowAddModal(true);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    setSelectedPlant(null);
    // Optionally refresh data
    fetchTasks();
  };

  const handleSeeMorePlants = () => {
    navigate('/plants');
  };

  const handleAddNewPlant = () => {
    navigate('/plants/');
  };

  const handleAddNewTask = () => {
    navigate('/tasks/add');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(prev => !prev);
    // Close notifications if menu is opening
    if (!isMenuOpen && isNotificationOpen) {
      setIsNotificationOpen(false);
    }
  };

  const handleNotificationToggle = () => {
    setIsNotificationOpen(prev => !prev);
    // Close menu if notifications are opening
    if (!isNotificationOpen && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleTaskDescriptionClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handlePlantClick = (plant: PopularPlant) => {
    navigate(`/plants/${plant.id}`);
  };

  // Filter tasks and plants based on search query
  const filteredTasks = tasks.filter(task =>
    task.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlants = popularPlants.filter(plant =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close overlays when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (isMenuOpen && !target.closest('.menu-container')) {
        setIsMenuOpen(false);
      }
      
      if (isNotificationOpen && !target.closest('.notification-container')) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isNotificationOpen]);

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Header */}
      <div className="relative flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
        <button 
          onClick={handleMenuToggle}
          className="p-2 transition-colors rounded-lg hover:bg-gray-100 menu-container"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-primary-800">Good morning</h1>
        <button 
          onClick={handleNotificationToggle}
          className="relative p-2 transition-colors rounded-lg hover:bg-gray-100 notification-container"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {notifications.length > 0 && (
            <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Side Menu */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-lg top-full menu-container">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Menu</h3>
                <button 
                  onClick={handleMenuToggle}
                  className="p-1 rounded-lg hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <button 
                onClick={() => { navigate('/garden'); setIsMenuOpen(false); }}
                className="flex items-center w-full gap-3 p-3 text-left rounded-lg hover:bg-gray-50"
              >
                <Sprout className="w-5 h-5 text-green-600" />
                <span className="text-gray-800">My Garden</span>
              </button>
              <button 
                onClick={() => { navigate('/plants'); setIsMenuOpen(false); }}
                className="flex items-center w-full gap-3 p-3 text-left rounded-lg hover:bg-gray-50"
              >
                <Book className="w-5 h-5 text-green-600" />
                <span className="text-gray-800">Plant Library</span>
              </button>
              <button 
                onClick={() => { navigate('/tasks'); setIsMenuOpen(false); }}
                className="flex items-center w-full gap-3 p-3 text-left rounded-lg hover:bg-gray-50"
              >
                <PenTool className="w-5 h-5 text-green-600" />
                <span className="text-gray-800">Task</span>
              </button>
              <button 
                onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                className="flex items-center w-full gap-3 p-3 text-left rounded-lg hover:bg-gray-50"
              >
                <User className="w-5 h-5 text-green-600" />
                <span className="text-gray-800">Profile</span>
              </button>
              <hr className="my-3" />
              <button 
                onClick={() => { navigate('/settings'); setIsMenuOpen(false); }}
                className="flex items-center w-full gap-3 p-3 text-left rounded-lg hover:bg-gray-50"
              >
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Settings</span>
              </button>
              <button 
                onClick={() => { navigate('/help'); setIsMenuOpen(false); }}
                className="flex items-center w-full gap-3 p-3 text-left rounded-lg hover:bg-gray-50"
              >
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Help & Support</span>
              </button>
            </div>
          </div>
        )}

        {/* Notifications */}
        {isNotificationOpen && (
          <div className="absolute right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg top-full w-80 notification-container">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <button 
                  onClick={handleNotificationToggle}
                  className="p-1 rounded-lg hover:bg-gray-100"
                  aria-label="Close notifications"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="p-3 text-center text-gray-500">
                    <p className="text-sm">No new notifications</p>
                  </div>
                ) : (
                  notifications.map(notif => {
                    const colorClasses = {
                      green: 'border-green-200 bg-green-50 text-green-800',
                      blue: 'border-blue-200 bg-blue-50 text-blue-800',
                      red: 'border-red-200 bg-red-50 text-red-800',
                      yellow: 'border-yellow-200 bg-yellow-50 text-yellow-800'
                    };
                    
                    return (
                      <div key={notif.id} className={`p-3 border rounded-lg ${colorClasses[notif.color as keyof typeof colorClasses]}`}>
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs opacity-80">{notif.message}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-5">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <Input
            placeholder="Search plants and tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleAddNewPlant}
            className="flex items-center justify-center gap-2"
          >
            <Sprout className="w-5 h-5" />
            Add a plant
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleAddNewTask}
            className="flex items-center justify-center gap-2"
          >
            <ClipboardCheck className="w-5 h-5" />
            Add a task
          </Button>
        </div>

        {/* Today's Tasks Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-green-800">Today's tasks</h2>
          
          {isLoading ? (
            <div className="py-8 text-center card">
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-8 text-center card">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-2 font-medium text-gray-800">No tasks today</h3>
              <p className="text-gray-600">You're all caught up! Enjoy your day.</p>
            </div>
          ) : (
            <>
              {/* Task Summary */}
              <div className="mb-4 card">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-medium text-gray-800">
                      {totalTodayTasks - todayTasksCompleted} task{totalTodayTasks - todayTasksCompleted !== 1 ? 's' : ''} await{totalTodayTasks - todayTasksCompleted === 1 ? 's' : ''} you
                    </h3>
                    <p className="text-sm text-gray-600">Complete all your tasks for today</p>
                  </div>
                  <div className="px-3 py-1 bg-gray-100 rounded-full">
                    <span className="text-sm font-medium text-gray-700">
                      {todayTasksCompleted}/{totalTodayTasks}
                    </span>
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="card">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={task.imageUrl} 
                          alt={task.plantName}
                          className="object-cover w-16 h-16 rounded-xl"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-plant.jpg';
                          }}
                        />
                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                          <Scissors className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1 text-lg font-semibold text-gray-800">{task.type}</h3>
                        <h4 className="font-medium text-gray-700 truncate">{task.plantName}</h4>
                        <p className="mb-2 text-sm text-gray-500">{task.location}</p>
                        <button 
                          onClick={() => handleTaskDescriptionClick(task)}
                          className="text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          {task.description}
                        </button>
                      </div>
                      <button 
                        onClick={() => handleTaskComplete(task.id)}
                        disabled={task.isCompleted}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                          task.isCompleted 
                            ? 'bg-green-600 border-green-600 cursor-default' 
                            : 'border-green-400 hover:border-green-600 hover:bg-green-50'
                        }`}
                        aria-label={task.isCompleted ? 'Task completed' : 'Mark as complete'}
                      >
                        {task.isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-green-400 rounded-full"></div>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Most Popular Plants Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Popular Plants</h2>
            <button 
              onClick={handleSeeMorePlants}
              className="flex items-center gap-1 font-medium text-green-600 hover:text-green-700"
            >
              See all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {popularPlants.length === 0 ? (
            <div className="py-8 text-center card">
              <p className="text-gray-600">No plants available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredPlants.map((plant) => (
                <div key={plant.id} className="card">
                  <div className="flex items-center gap-4">
                    <img 
                      src={plant.imageUrl} 
                      alt={plant.name}
                      className="flex-shrink-0 object-cover w-16 h-16 rounded-lg cursor-pointer"
                      onClick={() => handlePlantClick(plant)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-plant.jpg';
                      }}
                    />
                    <div 
                      className="flex-1 min-w-0 cursor-pointer" 
                      onClick={() => handlePlantClick(plant)}
                    >
                      <h3 className="mb-1 font-semibold text-gray-800">{plant.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{plant.description}</p>
                    </div>
                    <button 
                      onClick={() => handleAddPlant(plant)}
                      className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white transition-colors bg-green-600 rounded-full hover:bg-green-700"
                      aria-label={`Add ${plant.name} to garden`}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Task Details</h3>
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-lg hover:bg-gray-100"
                aria-label="Close task details"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedTask.imageUrl} 
                  alt={selectedTask.plantName}
                  className="object-cover w-16 h-16 rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-plant.jpg';
                  }}
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedTask.type}</h4>
                  <p className="text-gray-600">{selectedTask.plantName}</p>
                  <p className="text-sm text-gray-500">{selectedTask.location}</p>
                </div>
              </div>
              <div>
                <h5 className="mb-2 font-medium text-gray-800">Instructions:</h5>
                <p className="text-sm text-gray-600">
                  {selectedTask.type === 'Prune' && 'Use clean, sharp scissors to remove dead or overgrown branches. Cut at a 45-degree angle just above a leaf node.'}
                  {selectedTask.type === 'Water' && 'Water thoroughly until water drains from the bottom. Check soil moisture with your finger before watering.'}
                  {selectedTask.type === 'Fertilize' && 'Apply liquid fertilizer according to package instructions. Water the plant first, then apply fertilizer.'}
                  {selectedTask.type === 'Repot' && 'Choose a pot one size larger. Gently remove plant, loosen roots, and place in new pot with fresh soil.'}
                  {!['Prune', 'Water', 'Fertilize', 'Repot'].includes(selectedTask.type) && 
                    'Follow general plant care guidelines for this task.'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedTask(null)}
                >
                  Close
                </Button>
                {!selectedTask.isCompleted && (
                  <Button 
                    variant="primary" 
                    className="flex-1"
                    onClick={() => {
                      handleTaskComplete(selectedTask.id);
                      setSelectedTask(null);
                    }}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Plant Modal */}
      <AddPlantModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedPlant(null);
        }}
        onSuccess={handleAddSuccess}
        plantName={selectedPlant?.name || ''}
        plantSpecies={selectedPlant?.name || ''}
        plantId={selectedPlant?.id || ''}
        plantImageUrl={selectedPlant?.imageUrl || ''}
      />
    </div>
  );
};

export default HomePage;