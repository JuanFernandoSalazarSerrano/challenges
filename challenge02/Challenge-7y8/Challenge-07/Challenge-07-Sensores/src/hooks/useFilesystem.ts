import { useState } from 'react';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

const FILE_NAME = 'challenge-07-note.txt';

export const useFilesystem = () => {
  const [permissionText, setPermissionText] = useState<string>('unknown');
  const [content, setContent] = useState<string>('');
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const checkPermission = async () => {
    const status = await Filesystem.checkPermissions();
    setPermissionText(status.publicStorage);
    return status;
  };

  const requestPermission = async () => {
    const status = await Filesystem.requestPermissions();
    setPermissionText(status.publicStorage);
    return status;
  };

  const writeSampleFile = async () => {
    try {
      setError('');
      const now = new Date().toISOString();
      await Filesystem.writeFile({
        path: FILE_NAME,
        data: `Challenge 07 - archivo generado en ${now}`,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo escribir archivo');
    }
  };

  const readSampleFile = async () => {
    try {
      setError('');
      const result = await Filesystem.readFile({
        path: FILE_NAME,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      setContent(typeof result.data === 'string' ? result.data : 'Archivo binario no mostrado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo leer archivo');
    }
  };

  const listFiles = async () => {
    try {
      setError('');
      const result = await Filesystem.readdir({
        path: '',
        directory: Directory.Documents,
      });

      setFiles(result.files.map((file) => file.name));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo listar archivos');
    }
  };

  const deleteSampleFile = async () => {
    try {
      setError('');
      await Filesystem.deleteFile({
        path: FILE_NAME,
        directory: Directory.Documents,
      });
      setContent('');
      await listFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar archivo');
    }
  };

  return {
    permissionText,
    content,
    files,
    error,
    checkPermission,
    requestPermission,
    writeSampleFile,
    readSampleFile,
    listFiles,
    deleteSampleFile,
  };
};
