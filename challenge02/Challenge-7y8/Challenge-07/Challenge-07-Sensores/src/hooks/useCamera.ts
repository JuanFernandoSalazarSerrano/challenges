import { useEffect, useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const useCamera = () => {
  const [permissionText, setPermissionText] = useState<string>('unknown');
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const checkPermission = async () => {
    const status = await Camera.checkPermissions();
    setPermissionText(`${status.camera}${status.photos ? ` / ${status.photos}` : ''}`);
    return status;
  };

  const requestPermission = async () => {
    const status = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
    setPermissionText(`${status.camera}${status.photos ? ` / ${status.photos}` : ''}`);
    return status;
  };

  const getPhoto = async (source: CameraSource) => {
    try {
      setError('');
      const status = await Camera.checkPermissions();
      if (status.camera !== 'granted' && source === CameraSource.Camera) {
        await requestPermission();
      }

      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source,
      });

      setImageDataUrl(photo.dataUrl ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo obtener imagen');
    }
  };

  useEffect(() => {
    checkPermission().catch(() => {
      setPermissionText('error');
    });
  }, []);

  return {
    permissionText,
    imageDataUrl,
    error,
    checkPermission,
    requestPermission,
    takePhoto: () => getPhoto(CameraSource.Camera),
    pickFromGallery: () => getPhoto(CameraSource.Photos),
  };
};
