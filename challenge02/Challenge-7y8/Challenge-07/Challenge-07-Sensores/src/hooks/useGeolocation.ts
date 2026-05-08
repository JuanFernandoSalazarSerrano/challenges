import { useEffect, useRef, useState } from 'react';
import { Geolocation, type Position } from '@capacitor/geolocation';

export const useGeolocation = () => {
  const [permissionText, setPermissionText] = useState<string>('unknown');
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string>('');
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const watchIdRef = useRef<string | null>(null);

  const checkPermission = async () => {
    const status = await Geolocation.checkPermissions();
    setPermissionText(`${status.location}${status.coarseLocation ? ` / ${status.coarseLocation}` : ''}`);
    return status;
  };

  const requestPermission = async () => {
    try {
      const status = await Geolocation.requestPermissions();
      setPermissionText(`${status.location}${status.coarseLocation ? ` / ${status.coarseLocation}` : ''}`);
      return status;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo solicitar permiso');
      throw err;
    }
  };

  const getCurrentPosition = async () => {
    try {
      setError('');
      const current = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      setPosition(current);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo obtener ubicacion');
    }
  };

  const startWatching = async () => {
    if (watchIdRef.current) {
      return;
    }

    setError('');
    const id = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
      (nextPosition, err) => {
        if (err) {
          setError(err.message ?? 'Error en seguimiento');
          return;
        }

        if (nextPosition) {
          setPosition(nextPosition);
        }
      }
    );

    watchIdRef.current = id;
    setIsWatching(true);
  };

  const stopWatching = async () => {
    if (!watchIdRef.current) {
      return;
    }

    await Geolocation.clearWatch({ id: watchIdRef.current });
    watchIdRef.current = null;
    setIsWatching(false);
  };

  useEffect(() => {
    checkPermission().catch(() => {
      setPermissionText('error');
    });

    return () => {
      if (watchIdRef.current) {
        Geolocation.clearWatch({ id: watchIdRef.current }).catch(() => undefined);
      }
    };
  }, []);

  return {
    permissionText,
    position,
    error,
    isWatching,
    checkPermission,
    requestPermission,
    getCurrentPosition,
    startWatching,
    stopWatching,
  };
};
