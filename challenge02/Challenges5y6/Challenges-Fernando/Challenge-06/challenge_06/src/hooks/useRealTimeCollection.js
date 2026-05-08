import { useState, useEffect, useCallback } from 'react';
import {
  ref,
  set,
  remove,
  onValue,
  update,
} from 'firebase/database';
import { rtdb } from '../services/firebaseConfig';

export const useRealTimeCollection = (path) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      const dbRef = ref(rtdb, path);
      
      const unsubscribe = onValue(
        dbRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const dbData = snapshot.val();
            if (typeof dbData === 'object' && !Array.isArray(dbData)) {
              const items = Object.keys(dbData).map(key => ({
                id: key,
                ...dbData[key],
              }));
              setData(items);
            } else {
              setData(dbData || []);
            }
          } else {
            setData([]);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
          console.error('Error reading from database:', err);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [path]);

  const getAll = useCallback(() => {
    return data;
  }, [data]);

  const add = useCallback(async (newData) => {
    try {
      setLoading(true);
      setError(null);
      const id = Date.now().toString();
      const itemRef = ref(rtdb, `${path}/${id}`);
      await set(itemRef, {
        ...newData,
        id,
        createdAt: new Date().toISOString(),
      });
      return id;
    } catch (err) {
      setError(err.message);
      console.error('Error adding item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [path]);

  const updateItem = useCallback(async (itemId, updatedData) => {
    try {
      setLoading(true);
      setError(null);
      const itemRef = ref(rtdb, `${path}/${itemId}`);
      await update(itemRef, {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message);
      console.error('Error updating item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [path]);

  const deleteItem = useCallback(async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      const itemRef = ref(rtdb, `${path}/${itemId}`);
      await remove(itemRef);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [path]);

  return {
    data,
    loading,
    error,
    getAll,
    add,
    update: updateItem,
    delete: deleteItem,
    setData,
  };
};

export default useRealTimeCollection;
