import { useEffect, useRef, useState } from 'react';
import { Motion } from '@capacitor/motion';
import type { PluginListenerHandle } from '@capacitor/core';

type AccelData = {
  x: number;
  y: number;
  z: number;
};

type OrientationData = {
  alpha: number;
  beta: number;
  gamma: number;
};

export const useAccelerometer = () => {
  const [accelData, setAccelData] = useState<AccelData | null>(null);
  const [orientationData, setOrientationData] = useState<OrientationData | null>(null);
  const [activeSensor, setActiveSensor] = useState<'none' | 'accel' | 'orientation'>('none');
  const [error, setError] = useState<string>('');

  const accelHandleRef = useRef<PluginListenerHandle | null>(null);
  const orientationHandleRef = useRef<PluginListenerHandle | null>(null);

  const stopAll = async () => {
    await accelHandleRef.current?.remove();
    await orientationHandleRef.current?.remove();
    accelHandleRef.current = null;
    orientationHandleRef.current = null;
    setActiveSensor('none');
  };

  const startAccel = async () => {
    try {
      setError('');
      await stopAll();
      accelHandleRef.current = await Motion.addListener('accel', (event) => {
        setAccelData({
          x: Number(event.acceleration.x.toFixed(4)),
          y: Number(event.acceleration.y.toFixed(4)),
          z: Number(event.acceleration.z.toFixed(4)),
        });
      });
      setActiveSensor('accel');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar acelerometro');
    }
  };

  const startOrientation = async () => {
    try {
      setError('');
      await stopAll();
      orientationHandleRef.current = await Motion.addListener('orientation', (event) => {
        setOrientationData({
          alpha: Number(event.alpha.toFixed(4)),
          beta: Number(event.beta.toFixed(4)),
          gamma: Number(event.gamma.toFixed(4)),
        });
      });
      setActiveSensor('orientation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar orientacion');
    }
  };

  useEffect(() => {
    return () => {
      stopAll().catch(() => undefined);
    };
  }, []);

  return {
    accelData,
    orientationData,
    activeSensor,
    error,
    startAccel,
    startOrientation,
    stopAll,
  };
};
