import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export interface SensorStatus {
  isMoving: boolean;
  isConnected: boolean;
  isWiFi: boolean;
  batteryLevel: number;
  batteryIsLow: boolean;
}

export const sensorService = {
  checkDeviceMotion: (speed: number | null): boolean => {
    if (speed === null) return false;
    return speed > 0.5;
  },

  checkNetworkStatus: async (): Promise<{ isConnected: boolean; isWiFi: boolean }> => {
    try {
      const status = await Network.getStatus();
      return {
        isConnected: status.connected,
        isWiFi: status.connectionType === 'wifi',
      };
    } catch (error) {
      console.error('Error checking network:', error);
      return { isConnected: false, isWiFi: false };
    }
  },

  getBatteryStatus: async (): Promise<{ level: number; isLow: boolean }> => {
    try {
      const battery = await Device.getBatteryInfo();
      const rawLevel = battery.batteryLevel;

      return {
        level: typeof rawLevel === 'number' ? Math.round(rawLevel * 100) : 100,
        isLow: typeof rawLevel === 'number' ? rawLevel < 0.2 : false,
      };
    } catch (error) {
      console.error('Error getting battery status:', error);
      return { level: 100, isLow: false };
    }
  },

  vibrate: async (duration: number = 100): Promise<void> => {
    try {
      await Haptics.vibrate({ duration });
    } catch (error) {
      console.error('Error vibrating:', error);
    }
  },

  notificationHaptic: async (): Promise<void> => {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.error('Error notification haptic:', error);
    }
  },
};

export const setupNetworkListener = (callback: (connected: boolean, isWiFi: boolean) => void) => {
  Network.addListener('networkStatusChange', async (status) => {
    callback(status.connected, status.connectionType === 'wifi');
  });
};
