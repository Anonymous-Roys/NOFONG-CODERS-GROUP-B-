import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { requestNotificationPermission, scheduleTaskNotification, registerServiceWorker } from '../../utils/notifications';

interface TaskManagerProps {
  onBack?: () => void;
}

export const TaskManager: React.FC<TaskManagerProps> = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deletedTask, setDeletedTask] = useState<any | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  useEffect(() => {
    fetchTasks();
    initializeNotifications();
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkDueTasks = () => {
      
      const dueNow = getTasksByStatus().dueNow;
      
      dueNow.forEach(task => {
        if (notificationPermission && !task.notified) {
          showTaskNotification(task);
          setTasks(prev => prev.map(t => 
            t.id === task.id ? { ...t, notified: true } : t
          ));
        }
      });
    };
    
    const interval = setInterval(checkDueTasks, 60000);
    return () => clearInterval(interval);
  }, [tasks, notificationPermission]);

  const initializeNotifications = async () => {
    await registerServiceWorker();
    const hasPermission = await requestNotificationPermission();
    setNotificationPermission(hasPermission);
  };

  const fetchTasks = async () => {
    try {
      const data = await apiFetch('/api/tasks');
      const mappedTasks = data.map((task: any) => {
        const taskDate = new Date(task.date);
        const [hours, minutes] = task.time.split(':');
        taskDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        return {
          id: task._id,
          plantName: task.plantId?.name || 'Unknown Plant',
          plantId: task.plantId?._id,
          type: task.type,
          time: new Date(task.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          frequency: task.frequency || 'Once',
          imageUrl: task.plantId?.photoUrl || '/1.png',
          completed: task.completed,
          date: task.date,
          originalTime: task.time,
          alarmEnabled: task.alarmEnabled,
          notificationEnabled: task.notificationEnabled,
          dueDateTime: taskDate,
          notified: false
        };
      });
      
      setTasks(mappedTasks);
      
      // Schedule notifications for upcoming tasks
      mappedTasks.forEach((task: any) => {
        if (!task.completed && notificationPermission) {
          scheduleTaskNotification(task);
        }
      });
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async (taskId: string) => {
    try {
      const taskToDelete = tasks.find(task => task.id === taskId);
      await apiFetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setDeletedTask(taskToDelete);
      setShowDeleteConfirm(null);
      setShowUndo(true);
      setTimeout(() => setShowUndo(false), 5000);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const undoDelete = async () => {
    if (deletedTask) {
      try {
        await apiFetch('/api/tasks', {
          method: 'POST',
          body: JSON.stringify({
            type: deletedTask.type,
            plantId: deletedTask.plantId,
            time: deletedTask.originalTime || deletedTask.time,
            date: deletedTask.date,
            frequency: deletedTask.frequency,
            alarmEnabled: deletedTask.alarmEnabled,
            notificationEnabled: deletedTask.notificationEnabled
          })
        });
        fetchTasks();
        setShowUndo(false);
        setDeletedTask(null);
      } catch (err) {
        console.error('Failed to restore task:', err);
      }
    }
  };

  const showTaskNotification = (task: any) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🌱 ${task.plantName} needs ${task.type}!`, {
        body: `It's time to ${task.type} your ${task.plantName}`,
        icon: task.imageUrl,
        tag: task.id
      });
    }
  };

  const getTasksByStatus = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const completed = tasks.filter(task => task.completed);
    const pending = tasks.filter(task => !task.completed);
    
    const dueNow = pending.filter(task => {
      const taskTime = task.dueDateTime;
      return taskTime <= now && taskTime >= today;
    });
    
    const upcoming = pending.filter(task => {
      const taskTime = task.dueDateTime;
      return taskTime > now;
    });
    
    const overdue = pending.filter(task => {
      const taskTime = task.dueDateTime;
      return taskTime < today;
    });
    
    return { completed, dueNow, upcoming, overdue };
  };

  const markCompleted = async (taskId: string) => {
    try {
      await apiFetch(`/api/tasks/${taskId}/complete`, { method: 'PATCH' });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      ));
      
      // Play completion sound
      const audio = new Audio('/completed-sound.wav');
      audio.play().catch(() => {});
    } catch (err) {
      console.error('Failed to mark task as completed:', err);
    }
  };

  const TaskSection = ({ title, tasks: sectionTasks, color }: { title: string; tasks: any[]; color: string }) => {
    if (sectionTasks.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold" style={{ color }}>
          {title} ({sectionTasks.length})
        </h2>
        <div className="space-y-3">
          {sectionTasks.map((task) => (
            <div key={task.id} className={`p-4 bg-white shadow-sm rounded-2xl ${title === 'Due Now' ? 'border-l-4 border-red-500' : ''}`}>
              <div className="flex items-center gap-4">
                <img 
                  src={task.imageUrl} 
                  alt={task.plantName}
                  className="object-cover w-16 h-16 rounded-full"
                />
                <div className="flex-1 cursor-pointer" onClick={() => setSelectedTask(task)}>
                  <h3 className="font-semibold text-gray-800">
                    {task.plantName} - {task.type}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {task.time} - {task.frequency}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!task.completed && (
                    <button 
                      onClick={() => markCompleted(task.id)}
                      className="p-2 text-green-600"
                      title="Mark task as completed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      const text = `${task.plantName} needs ${task.type} at ${task.time}`;
                      if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(text);
                        speechSynthesis.speak(utterance);
                      }
                    }}
                    className="p-2 text-blue-600"
                    title="Read task details aloud"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 7h4l5-5v20l-5-5H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => navigate(`/tasks/edit/${task.id}`)}
                    className="p-2 text-green-600"
                    title="Edit this task"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(task.id)}
                    className="p-2 text-red-500"
                    title="Delete this task"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-b-2 border-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white">
        <button className="p-2" title="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-green-600">
          Task Manager
          <span className="block text-xs font-normal text-gray-500">
            {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </span>
        </h1>
        <button 
          onClick={async () => {
            const permission = await requestNotificationPermission();
            setNotificationPermission(permission);
          }}
          className="p-2"
          title={notificationPermission ? "Notifications enabled" : "Enable notifications"}
        >
          <svg className="w-6 h-6" fill={notificationPermission ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4" />
          </svg>
        </button>
      </div>

      {/* Task Sections */}
      <div className="px-5 py-4">
        {(() => {
          const { completed, dueNow, upcoming, overdue } = getTasksByStatus();
          return (
            <>
              <TaskSection title="Due Now" tasks={dueNow} color="#dc2626" />
              <TaskSection title="Overdue" tasks={overdue} color="#b91c1c" />
              <TaskSection title="Upcoming" tasks={upcoming} color="#059669" />
              <TaskSection title="Completed Today" tasks={completed} color="#6b7280" />
            </>
          );
        })()}
      </div>

      {/* Add New Task Button */}
      <div className="fixed bottom-24 left-4 right-4">
        <button
          onClick={() => navigate('/tasks/add')}
          className="w-full py-4 text-lg font-semibold text-white bg-green-600 rounded-2xl"
        >
          Add New Task
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 mx-4 bg-white rounded-2xl">
            <h3 className="mb-4 text-lg font-semibold">Delete Task?</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 font-medium text-gray-800 bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-3 font-medium text-white bg-red-500 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Undo Toast */}
      {showUndo && (
        <div className="fixed z-50 flex items-center justify-between p-4 text-white bg-gray-800 bottom-32 left-4 right-4 rounded-2xl">
          <span>Task deleted successfully</span>
          <button
            onClick={undoDelete}
            className="px-4 py-2 font-medium bg-green-600 rounded-xl"
          >
            Undo
          </button>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Task Details</h3>
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedTask.imageUrl} 
                  alt={selectedTask.plantName}
                  className="object-cover w-16 h-16 rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedTask.type}</h4>
                  <p className="text-gray-600">{selectedTask.plantName}</p>
                  <p className="text-sm text-gray-500">{selectedTask.time}</p>
                </div>
              </div>
              <div>
                <h5 className="mb-2 font-medium text-gray-800">Instructions:</h5>
                <p className="text-sm text-gray-600">
                  {selectedTask.type === 'prune' && 'Use clean, sharp scissors to remove dead or overgrown branches. Cut at a 45-degree angle just above a leaf node.'}
                  {selectedTask.type === 'water' && 'Water thoroughly until water drains from the bottom. Check soil moisture with your finger before watering.'}
                  {selectedTask.type === 'fertilize' && 'Apply liquid fertilizer according to package instructions. Water the plant first, then apply fertilizer.'}
                  {selectedTask.type === 'repot' && 'Choose a pot one size larger. Gently remove plant, loosen roots, and place in new pot with fresh soil.'}
                  {!['prune', 'water', 'fertilize', 'repot'].includes(selectedTask.type) && 
                    'Follow general plant care guidelines for this task.'}
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-xl"
                  onClick={() => setSelectedTask(null)}
                >
                  Close
                </button>
                {!selectedTask.completed && (
                  <button 
                    className="flex-1 px-4 py-2 text-white bg-green-600 rounded-xl"
                    onClick={() => {
                      markCompleted(selectedTask.id);
                      setSelectedTask(null);
                    }}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};