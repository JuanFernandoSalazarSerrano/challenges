import { useState } from 'react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const useHaptics = () => {
  const [error, setError] = useState<string>('');

  const triggerImpact = async (style: ImpactStyle) => {
    try {
      setError('');
      await Haptics.impact({ style });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en haptics impact');
    }
  };

  const triggerNotification = async (type: NotificationType) => {
    try {
      setError('');
      await Haptics.notification({ type });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en haptics notification');
    }
  };

  const vibrate = async () => {
    try {
      setError('');
      await Haptics.vibrate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en vibracion');
    }
  };

  return {
    error,
    triggerImpact,
    triggerNotification,
    vibrate,
  };
};
