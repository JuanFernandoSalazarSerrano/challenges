import { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';

export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [networkType, setNetworkType] = useState('');

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const status = await Network.getStatus();
        setIsOnline(status.connected);
        setNetworkType(status.connectionType);
      } catch (err) {
        console.error('Error checking network status:', err);
        setIsOnline(true);
      }
    };

    checkNetworkStatus();

    const unsubscribe = Network.addListener('networkStatusChange', (status) => {
      setIsOnline(status.connected);
      setNetworkType(status.connectionType);
    });

    return () => {
      unsubscribe.then(sub => sub.remove());
    };
  }, []);

  return {
    isOnline,
    networkType,
  };
};

export default useNetwork;
