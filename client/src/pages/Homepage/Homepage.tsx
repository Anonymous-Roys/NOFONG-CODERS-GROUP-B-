// src/pages/HomePage/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
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
  HelpCircle
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
  const [selectedPlant, setSelectedPlant] = useState<PopularPlant | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await apiFetch('/api/tasks');
      setTasks(data.map((task: any) => ({
        id: task._id,
        type: task.type,
        plantName: task.plantId?.name || 'Unknown Plant',
        location: 'Garden',
        isCompleted: task.completed,
        imageUrl: task.plantId?.photoUrl || task.plantId?.image || 'imagetomato.jpg',
        description: `Click to learn how to ${task.type}`
      })));
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const [todayTasksCompleted, setTodayTasksCompleted] = useState(0);
  const totalTodayTasks = tasks.length;

  const [popularPlants, setPopularPlants] = useState<PopularPlant[]>([]);

  useEffect(() => {
    fetchPopularPlants();
  }, []);

  const fetchPopularPlants = async () => {
    try {
      const data = await apiFetch('/api/plant-library?limit=4');
      setPopularPlants(data.slice(0, 4).map((plant: any) => ({
        id: plant._id,
        name: plant.name,
        description: plant.description,
        imageUrl: plant.image || '/1.png'
      })));
    } catch (err) {
      console.error('Failed to fetch popular plants:', err);
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      await apiFetch(`/api/tasks/${taskId}/complete`, { method: 'PATCH' });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, isCompleted: true } : task
      ));
      setTodayTasksCompleted(prev => prev + 1);
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const handleAddPlant = (plantId: string) => {
    console.log('Adding plant:', plantId);
    // Navigate to add plant page or show modal
  };

  const handleSeeMorePlants = () => {
    navigate('/plants');
  };

  const handleAddNewPlant = () => {
    navigate('/plants');
  };

  const handleAddNewTask = () => {
    navigate('/tasks/add');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNotificationToggle = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleTaskDescriptionClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handlePlantClick = (plant: PopularPlant) => {
    setSelectedPlant(plant);
  };

  const filteredTasks = tasks.filter(task =>
    task.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlants = popularPlants.filter(plant =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100 relative">
        <button 
          onClick={handleMenuToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-primary-800">Good morning</h1>
        <button 
          onClick={handleNotificationToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Side Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Menu</h3>
                <button 
                  onClick={handleMenuToggle}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <button 
                onClick={() => { navigate('/garden'); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left"
              >
                <Sprout className="w-5 h-5 text-green-600" />
                <span className="text-gray-800">My Garden</span>
              </button>
              <button 
                onClick={() => { navigate('/plants'); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left"
              >
                <Book className="w-5 h-5 text-green-600" />
                <span className="text-gray-800">Plant Library</span>
              </button>
              <button 
                onClick={() => { navigate('/journal'); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left"
              >
                <PenTool className="w-5 h-5 text-green-600" />
                <span className="text-gray-800">Journal</span>
              </button>
              <button 
                onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left"
              >
                <User className="w-5 h-5 text-green-600" />
                <span className="text-gray-800">Profile</span>
              </button>
              <hr className="my-3" />
              <button 
                onClick={() => { navigate('/coming-soon'); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left"
              >
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Settings</span>
              </button>
              <button 
                onClick={() => { navigate('/coming-soon'); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left"
              >
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Help & Support</span>
              </button>
            </div>
          </div>
        )}

        {/* Notifications */}
        {isNotificationOpen && (
          <div className="absolute top-full right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <button 
                  onClick={handleNotificationToggle}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 font-medium">Task Reminder</p>
                  <p className="text-xs text-green-600">Water your Peace Lily in 2 hours</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium">Plant Tip</p>
                  <p className="text-xs text-blue-600">Your tomato plant is ready for pruning</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 font-medium">Weekly Summary</p>
                  <p className="text-xs text-yellow-600">You've completed 5 tasks this week!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-5">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <Input
            // label="Search plants and tasks"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // icon={<Search className="w-5 h-5 text-gray-400" />}
            className="pl-12"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleAddNewPlant}
            className="flex items-center justify-center gap-2 text-black"
          >
            <Sprout className="w-5 h-5" />
            Add a plant
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleAddNewTask}
            className="flex items-center justify-center gap-2 text-black"
          >
            <ClipboardCheck className="w-5 h-5" />
            Add a task
          </Button>
        </div>

        {/* Today's Tasks Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Today's tasks</h2>
          
          {tasks.length === 0 ? (
            <div className="card text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">No tasks today</h3>
              <p className="text-gray-600">You're all caught up! Enjoy your day.</p>
            </div>
          ) : (
            <>
              {/* Task Summary */}
              <div className="card mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1">
                      {totalTodayTasks - todayTasksCompleted} task{totalTodayTasks - todayTasksCompleted !== 1 ? 's' : ''} await{totalTodayTasks - todayTasksCompleted === 1 ? 's' : ''} you
                    </h3>
                    <p className="text-gray-600 text-sm">Complete all your tasks for today</p>
                  </div>
                  <div className="bg-gray-100 rounded-full px-3 py-1">
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
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                          <Scissors className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-lg mb-1">{task.type}</h3>
                        <h4 className="font-medium text-gray-700 truncate">{task.plantName}</h4>
                        <p className="text-sm text-gray-500 mb-2">{task.location}</p>
                        <button 
                          onClick={() => handleTaskDescriptionClick(task)}
                          className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          {task.description}
                        </button>
                      </div>
                      <button 
                        onClick={() => handleTaskComplete(task.id)}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                          task.isCompleted 
                            ? 'bg-green-600 border-green-600' 
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                        aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.isCompleted && <CheckCircle className="w-5 h-5 text-white" />}
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
              className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              See all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {filteredPlants.map((plant) => (
              <div key={plant.id} className="card">
                <div className="flex items-center gap-4">
                  <img 
                    src={plant.imageUrl} 
                    alt={plant.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 cursor-pointer"
                    onClick={() => handlePlantClick(plant)}
                  />
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handlePlantClick(plant)}>
                    <h3 className="font-semibold text-gray-800 mb-1">{plant.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{plant.description}</p>
                  </div>
                  <button 
                    onClick={() => handleAddPlant(plant.id)}
                    className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                    aria-label={`Add ${plant.name} to garden`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Task Details</h3>
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedTask.imageUrl} 
                  alt={selectedTask.plantName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedTask.type}</h4>
                  <p className="text-gray-600">{selectedTask.plantName}</p>
                  <p className="text-sm text-gray-500">{selectedTask.location}</p>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Instructions:</h5>
                <p className="text-gray-600 text-sm">
                  {selectedTask.type === 'Prune' && 'Use clean, sharp scissors to remove dead or overgrown branches. Cut at a 45-degree angle just above a leaf node.'}
                  {selectedTask.type === 'Water' && 'Water thoroughly until water drains from the bottom. Check soil moisture with your finger before watering.'}
                  {selectedTask.type === 'Fertilize' && 'Apply liquid fertilizer according to package instructions. Water the plant first, then apply fertilizer.'}
                  {selectedTask.type === 'Repot' && 'Choose a pot one size larger. Gently remove plant, loosen roots, and place in new pot with fresh soil.'}
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plant Details Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Plant Details</h3>
              <button 
                onClick={() => setSelectedPlant(null)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <img 
                  src={selectedPlant.imageUrl} 
                  alt={selectedPlant.name}
                  className="w-32 h-32 rounded-lg object-cover mx-auto mb-4"
                />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{selectedPlant.name}</h4>
                <p className="text-gray-600">{selectedPlant.description}</p>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-1">Care Level</h5>
                  <p className="text-sm text-green-600">Easy - Perfect for beginners</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-1">Light Requirements</h5>
                  <p className="text-sm text-blue-600">Bright, indirect light</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-1">Watering</h5>
                  <p className="text-sm text-yellow-600">Water when top inch of soil is dry</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedPlant(null)}
                >
                  Close
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => {
                    handleAddPlant(selectedPlant.id);
                    setSelectedPlant(null);
                  }}
                >
                  Add to Garden
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;