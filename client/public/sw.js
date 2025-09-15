self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'complete') {
    // Handle task completion
    fetch('/api/tasks/' + event.notification.tag + '/complete', {
      method: 'PATCH',
      credentials: 'include'
    });
  } else if (event.action === 'snooze') {
    // Schedule notification for 1 hour later
    const snoozeTime = Date.now() + 60 * 60 * 1000; // 1 hour
    self.registration.showNotification('🌱 Plant Care Reminder (Snoozed)', {
      body: event.notification.body,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: event.notification.tag + '_snooze',
      timestamp: snoozeTime
    });
  } else {
    // Default action - open the app
    clients.openWindow('/tasks');
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