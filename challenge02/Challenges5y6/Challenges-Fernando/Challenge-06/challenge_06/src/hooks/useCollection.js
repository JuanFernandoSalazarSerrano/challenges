import { useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
} from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const withTimeout = (promise, ms = 8000, message = 'Request timeout') => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

export const useCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const q = query(collection(db, collectionName));
      const snapshot = await withTimeout(
        getDocs(q),
        7000,
        'Could not load contacts. Verify Firestore is enabled in Firebase Console.'
      );
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(documents);
      return documents;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const add = useCallback(async (newData) => {
    try {
      setLoading(true);
      setError(null);
      const docRef = await withTimeout(
        addDoc(collection(db, collectionName), {
          ...newData,
          createdAt: new Date(),
        }),
        7000,
        'Could not save contact. Verify Firestore is enabled in Firebase Console.'
      );
      const newDocument = {
        id: docRef.id,
        ...newData,
        createdAt: new Date(),
      };
      setData(prev => [...prev, newDocument]);
      return docRef.id;
    } catch (err) {
      setError(err.message);
      console.error('Error adding document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const update = useCallback(async (docId, updatedData) => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, collectionName, docId);
      await withTimeout(
        updateDoc(docRef, {
          ...updatedData,
          updatedAt: new Date(),
        }),
        7000,
        'Could not update contact. Verify Firestore is enabled in Firebase Console.'
      );
      setData(prev =>
        prev.map(item =>
          item.id === docId
            ? { ...item, ...updatedData, updatedAt: new Date() }
            : item
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Error updating document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const remove = useCallback(async (docId) => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, collectionName, docId);
      await withTimeout(
        deleteDoc(docRef),
        7000,
        'Could not delete contact. Verify Firestore is enabled in Firebase Console.'
      );
      setData(prev => prev.filter(item => item.id !== docId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  return {
    data,
    loading,
    error,
    getAll,
    add,
    update,
    remove,
    setData,
  };
};

export default useCollection;
