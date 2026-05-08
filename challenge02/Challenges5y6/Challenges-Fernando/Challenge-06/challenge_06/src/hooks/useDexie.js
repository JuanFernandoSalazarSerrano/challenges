import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/dexieDB';

export const useDexie = (tableName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const data = useLiveQuery(async () => {
    try {
      const table = db.table(tableName);
      return await table.toArray();
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, [tableName]);

  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const table = db.table(tableName);
      const items = await table.toArray();
      return items;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [tableName]);

  const add = useCallback(async (newData) => {
    try {
      setLoading(true);
      setError(null);
      const table = db.table(tableName);
      const id = await table.add({
        ...newData,
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
  }, [tableName]);

  const update = useCallback(async (itemId, updatedData) => {
    try {
      setLoading(true);
      setError(null);
      const table = db.table(tableName);
      await table.update(itemId, {
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
  }, [tableName]);

  const deleteItem = useCallback(async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      const table = db.table(tableName);
      await table.delete(itemId);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tableName]);

  return {
    data: data || [],
    loading,
    error,
    getAll,
    add,
    update,
    delete: deleteItem,
  };
};

export default useDexie;
