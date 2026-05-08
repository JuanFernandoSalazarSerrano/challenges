import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';

export interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null | undefined;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export const useGeolocation = () => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState<string | null>(null);

  const getCurrentPosition = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const pos: Position = {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy,
        altitude: coordinates.coords.altitude,
        altitudeAccuracy: coordinates.coords.altitudeAccuracy,
        heading: coordinates.coords.heading,
        speed: coordinates.coords.speed,
        timestamp: coordinates.timestamp,
      };
      setPosition(pos);
      setError(null);
      return pos;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get position';
      setError(message);
      return null;
    }
  };

  const startTracking = async () => {
    try {
      const id = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
        (location, err) => {
          if (err) {
            setError(err.message);
            return;
          }

          if (location) {
            const pos: Position = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy,
              altitude: location.coords.altitude,
              altitudeAccuracy: location.coords.altitudeAccuracy,
              heading: location.coords.heading,
              speed: location.coords.speed,
              timestamp: location.timestamp,
            };
            setPosition(pos);
            setError(null);
          }
        }
      );
      setWatchId(id);
      setWatching(true);
      return id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start tracking';
      setError(message);
      return null;
    }
  };

  const stopTracking = async () => {
    if (watchId) {
      await Geolocation.clearWatch({ id: watchId });
      setWatchId(null);
      setWatching(false);
    }
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, [watchId]);

  return {
    position,
    error,
    watching,
    getCurrentPosition,
    startTracking,
    stopTracking,
  };
};
