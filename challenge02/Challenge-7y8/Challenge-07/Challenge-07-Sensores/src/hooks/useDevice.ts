import { useState } from 'react';
import { Device } from '@capacitor/device';

export const useDevice = () => {
  const [info, setInfo] = useState<Awaited<ReturnType<typeof Device.getInfo>> | null>(null);
  const [battery, setBattery] = useState<Awaited<ReturnType<typeof Device.getBatteryInfo>> | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const loadDeviceData = async () => {
    try {
      setError('');
      const [deviceInfo, batteryInfo, idInfo] = await Promise.all([
        Device.getInfo(),
        Device.getBatteryInfo(),
        Device.getId(),
      ]);

      setInfo(deviceInfo);
      setBattery(batteryInfo);
      setDeviceId(idInfo.identifier);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar informacion del dispositivo');
    }
  };

  return {
    info,
    battery,
    deviceId,
    error,
    loadDeviceData,
  };
};
