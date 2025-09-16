export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const scheduleTaskNotification = async (task: any) => {
  if (Notification.permission !== 'granted') return;

  const taskTime = task.dueDateTime || new Date(task.date);
  const now = new Date();
  const timeUntilTask = taskTime.getTime() - now.getTime();

  if (timeUntilTask > 0) {
    // Use service worker for background notifications
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration.active) {
        registration.active.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          task: {
            id: task.id,
            plantName: task.plantName,
            type: task.type
          },
          delay: timeUntilTask
        });
      }
    } else {
      // Fallback for browsers without service worker
      setTimeout(() => {
        new Notification(`🌱 ${task.plantName} needs ${task.type}!`, {
          body: `It's time to ${task.type} your ${task.plantName}`,
          icon: '/logo.png',
          badge: '/logo.png',
          tag: task.id,
          requireInteraction: true,
          silent: false
        });
      }, timeUntilTask);
    }
  }
};

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Request persistent notification permission
      if ('PushManager' in window) {
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: null
        }).catch(() => {});
      }
      
      return registration;
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  }
};

export const showTaskNotification = (task: any) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(`🌱 ${task.plantName} needs ${task.type}!`, {
      body: `It's time to ${task.type} your ${task.plantName}`,
      icon: '/logo.png',
      tag: task.id,
      requireInteraction: true,
      silent: false
    });
    
    // Play notification sound
    const audio = new Audio('/notification-sound.wav');
    audio.play().catch(() => {});
    
    return notification;
  }
};