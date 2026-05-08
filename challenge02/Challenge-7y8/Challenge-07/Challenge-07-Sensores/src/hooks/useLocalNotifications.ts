import { useEffect, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

export const useLocalNotifications = () => {
  const [permissionText, setPermissionText] = useState<string>('unknown');
  const [lastMessage, setLastMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const checkPermission = async () => {
    const status = await LocalNotifications.checkPermissions();
    setPermissionText(status.display);
    return status;
  };

  const requestPermission = async () => {
    const status = await LocalNotifications.requestPermissions();
    setPermissionText(status.display);
    return status;
  };

  const scheduleDemoNotification = async () => {
    try {
      setError('');
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 101,
            title: 'Challenge 07',
            body: 'Notificacion local enviada desde Ionic + Capacitor',
            schedule: { at: new Date(Date.now() + 5000) },
          },
        ],
      });
      setLastMessage('Notificacion programada para 5 segundos.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo programar notificacion local');
    }
  };

  useEffect(() => {
    const setup = async () => {
      await checkPermission();
      await LocalNotifications.addListener('localNotificationReceived', (notification) => {
        setLastMessage(`Recibida: ${notification.title ?? 'Sin titulo'}`);
      });
    };

    setup().catch(() => {
      setPermissionText('error');
    });

    return () => {
      LocalNotifications.removeAllListeners().catch(() => undefined);
    };
  }, []);

  return {
    permissionText,
    lastMessage,
    error,
    checkPermission,
    requestPermission,
    scheduleDemoNotification,
  };
};
