self.addEventListener('push', event => {
  let data;
  try { data = event.data?.json(); } catch { return; }
  if (!data || !Number.isSafeInteger(data.fixtureId) || typeof data.title !== 'string' || typeof data.body !== 'string') return;
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body, icon: '/images/match-alerts-192.png',
    tag: 'sports-match-' + data.fixtureId, renotify: true
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/aupl%20live.html'));
});
