self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'complete') {
    fetch('/api/tasks/' + event.notification.tag + '/complete', {
      method: 'PATCH',
      credentials: 'include'
    });
  } else if (event.action === 'snooze') {
    const snoozeTime = Date.now() + 60 * 60 * 1000;
    self.registration.showNotification('🌱 Plant Care Reminder (Snoozed)', {
      body: event.notification.body,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: event.notification.tag + '_snooze',
      timestamp: snoozeTime,
      silent: false
    });
  } else {
    clients.openWindow('/tasks');
  }
});

self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { task, delay } = event.data;
    
    setTimeout(() => {
      self.registration.showNotification(`🌱 ${task.plantName} needs ${task.type}!`, {
        body: `It's time to ${task.type} your ${task.plantName}`,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: task.id,
        requireInteraction: true,
        silent: false,
        actions: [
          { action: 'complete', title: 'Mark Complete' },
          { action: 'snooze', title: 'Snooze 1hr' }
        ]
      });
    }, delay);
  }
});

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: data.tag,
      requireInteraction: true,
      silent: false,
      actions: [
        { action: 'complete', title: 'Mark Complete' },
        { action: 'snooze', title: 'Snooze 1hr' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});