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

export const scheduleTaskNotification = (task: any) => {
  if (Notification.permission !== 'granted') return;

  const taskTime = new Date(task.date);
  const now = new Date();
  const timeUntilTask = taskTime.getTime() - now.getTime();

  if (timeUntilTask > 0) {
    setTimeout(() => {
      new Notification(`🌱 Plant Care Reminder`, {
        body: `Time to ${task.type} your ${task.plantName}!`,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: task.id,
        requireInteraction: true
      });

      // Play notification sound
      const audio = new Audio('/notification-sound.wav');
      audio.play().catch(() => console.log('Could not play sound'));
    }, timeUntilTask);
  }
};

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  }
};