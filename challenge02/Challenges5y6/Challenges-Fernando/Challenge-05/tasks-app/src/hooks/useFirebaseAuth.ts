import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { firebaseAuth, isFirebaseConfigured } from '../firebase/config';
import type { AppUser } from '../types/auth';

const MOCK_AUTH_KEY = 'challenge05:mock-auth-user';
const MOCK_USERS_KEY = 'challenge05:mock-auth-users';

interface MockStoredUser {
  uid: string;
  email: string;
  password: string;
}

const mapToAppUser = (user: { uid: string; email: string | null }): AppUser => ({
  uid: user.uid,
  email: user.email ?? '',
});

const getStoredMockUsers = (): MockStoredUser[] => {
  const value = localStorage.getItem(MOCK_USERS_KEY);

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as MockStoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveStoredMockUsers = (users: MockStoredUser[]) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

export const useFirebaseAuth = () => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      const stored = localStorage.getItem(MOCK_AUTH_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as AppUser;
          setCurrentUser(parsed);
        } catch {
          setCurrentUser(null);
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setCurrentUser(user ? mapToAppUser(user) : null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      const users = getStoredMockUsers();
      const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

      if (!user || user.password !== password) {
        throw new Error('Invalid email or password.');
      }

      const appUser: AppUser = { uid: user.uid, email: user.email };
      localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(appUser));
      setCurrentUser(appUser);
      return;
    }

    const credentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
    setCurrentUser(mapToAppUser(credentials.user));
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      const users = getStoredMockUsers();
      const exists = users.some((item) => item.email.toLowerCase() === email.toLowerCase());

      if (exists) {
        throw new Error('This email is already registered.');
      }

      const newUser: MockStoredUser = {
        uid: `local-${Date.now()}`,
        email,
        password,
      };

      users.push(newUser);
      saveStoredMockUsers(users);

      const appUser: AppUser = { uid: newUser.uid, email: newUser.email };
      localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(appUser));
      setCurrentUser(appUser);
      return;
    }

    const credentials = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    setCurrentUser(mapToAppUser(credentials.user));
  }, []);

  const logout = useCallback(async () => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      localStorage.removeItem(MOCK_AUTH_KEY);
      setCurrentUser(null);
      return;
    }

    await signOut(firebaseAuth);
    setCurrentUser(null);
  }, []);

  return useMemo(
    () => ({
      currentUser,
      loading,
      login,
      register,
      logout,
      isFirebaseConfigured,
    }),
    [currentUser, loading, login, register, logout],
  );
};
