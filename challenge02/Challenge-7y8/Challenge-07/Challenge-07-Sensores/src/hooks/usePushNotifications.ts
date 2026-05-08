import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

export const usePushNotifications = () => {
  const [permissionText, setPermissionText] = useState<string>('unknown');
  const [token, setToken] = useState<string>('');
  const [lastNotification, setLastNotification] = useState<string>('');
  const [error, setError] = useState<string>('');

  const isNative = Capacitor.isNativePlatform();

  const checkPermission = async () => {
    if (!isNative) {
      setPermissionText('web-not-supported');
      return { receive: 'denied' as const };
    }

    const status = await PushNotifications.checkPermissions();
    setPermissionText(status.receive);
    return status;
  };

  const requestPermission = async () => {
    if (!isNative) {
      setPermissionText('web-not-supported');
      return { receive: 'denied' as const };
    }

    const status = await PushNotifications.requestPermissions();
    setPermissionText(status.receive);
    return status;
  };

  const registerForPush = async () => {
    try {
      if (!isNative) {
        setError('Push notifications solo funcionan en iOS/Android nativo.');
        return;
      }

      setError('');
      const status = await requestPermission();
      if (status.receive !== 'granted') {
        setError('Permiso de push denegado.');
        return;
      }

      await PushNotifications.register();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar push');
    }
  };

  useEffect(() => {
    const setup = async () => {
      await checkPermission();
      if (!isNative) {
        return;
      }

      await PushNotifications.addListener('registration', (tokenValue) => {
        setToken(tokenValue.value);
      });

      await PushNotifications.addListener('registrationError', (registrationError) => {
        setError(registrationError.error);
      });

      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        setLastNotification(notification.title ?? 'Push recibida');
      });
    };

    setup().catch(() => {
      setPermissionText('error');
    });

    return () => {
      if (isNative) {
        PushNotifications.removeAllListeners().catch(() => undefined);
      }
    };
  }, [isNative]);

  return {
    isNative,
    permissionText,
    token,
    lastNotification,
    error,
    checkPermission,
    requestPermission,
    registerForPush,
  };
};
