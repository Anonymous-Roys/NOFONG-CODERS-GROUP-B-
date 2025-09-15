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
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTasks();
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    await registerServiceWorker();
    const hasPermission = await requestNotificationPermission();
    setNotificationPermission(hasPermission);
  };

  const fetchTasks = async () => {
    try {
      const data = await apiFetch('/api/tasks');
      const mappedTasks = data.map((task: any) => ({
        id: task._id,
        plantName: task.plantId?.name || 'Unknown Plant',
        type: task.type,
        time: new Date(task.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        frequency: task.frequency || 'Once',
        imageUrl: task.plantId?.photoUrl || '/1.png',
        completed: task.completed,
        date: task.date
      }));
      
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
            time: deletedTask.time,
            date: new Date(),
            frequency: deletedTask.frequency
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center justify-between">
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-green-600">Task Manager</h1>
        <button 
          onClick={async () => {
            const permission = await requestNotificationPermission();
            setNotificationPermission(permission);
          }}
          className="p-2"
          title="Enable notifications"
        >
          <svg className="w-6 h-6" fill={notificationPermission ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4" />
          </svg>
        </button>
      </div>

      {/* Task List */}
      <div className="px-5 py-4 space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <img 
                src={task.imageUrl} 
                alt={task.plantName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {task.plantName} - {task.type}
                </h3>
                <p className="text-gray-600 text-sm">
                  {task.time} - {task.frequency}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const text = `${task.plantName} needs ${task.type} at ${task.time}`;
                    if ('speechSynthesis' in window) {
                      const utterance = new SpeechSynthesisUtterance(text);
                      speechSynthesis.speak(utterance);
                    }
                  }}
                  className="p-2 text-blue-600"
                  title="Read task aloud"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 7h4l5-5v20l-5-5H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
                  </svg>
                </button>
                <button 
                  onClick={() => navigate(`/tasks/edit/${task.id}`)}
                  className="p-2 text-green-600"
                  title="Edit task"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(task.id)}
                  className="p-2 text-red-500"
                  title="Delete task"
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

      {/* Add New Task Button */}
      <div className="fixed bottom-24 left-4 right-4">
        <button
          onClick={() => navigate('/tasks/add')}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg"
        >
          Add New Task
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Task?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Undo Toast */}
      {showUndo && (
        <div className="fixed bottom-32 left-4 right-4 bg-gray-800 text-white p-4 rounded-2xl flex items-center justify-between z-50">
          <span>Task deleted successfully</span>
          <button
            onClick={undoDelete}
            className="bg-green-600 px-4 py-2 rounded-xl font-medium"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
};