import notifee, { AndroidImportance } from '@notifee/react-native';

// 1. Create the persistent channel Android requires
export const createNotificationChannel = async () => {
  await notifee.createChannel({
    id: 'meditation_session',
    name: 'Meditation Session Playback',
    importance: AndroidImportance.HIGH,
  });
};

// 2. Start the Foreground Service (The Shield)
export const startNotificationService = async () => {
  // Use displayNotification to trigger the foreground service configuration layout
  await notifee.displayNotification({
    id: 'meditation_notification',
    title: 'Simply Meditation',
    body: 'Your meditation session is active...',
    android: {
      channelId: 'meditation_session',
      asForegroundServiceType: 2, // 2 = MEDIA_PLAYBACK
      color: '#4caf50',
      ongoing: true,              // Prevents user from swiping it away
      pressAction: {
        id: 'default',
        launchActivity: 'default',
      },
    },
  });
};

// 3. Stop the Foreground Service
export const stopNotificationService = async () => {
  // Clear the notification card, which terminates the underlying native service
  await notifee.cancelNotification('meditation_notification');
};