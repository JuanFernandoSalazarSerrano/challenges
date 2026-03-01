let session: boolean = localStorage.getItem('logged') === 'true';
const listeners: Set<() => void> = new Set();

export const getSnapshot = (): boolean => {
  return session;
};

export const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const setSession = (isLogged: boolean) => {
  session = isLogged;
  if (isLogged) {
    localStorage.setItem('logged', 'true');
  } else {
    localStorage.removeItem('logged');
  }
  notifyListeners();
};

export const getSession = (): boolean => {
  return session;
};

// Initialize session from localStorage on app start
export const initSession = () => {
  session = localStorage.getItem('logged') === 'true';
};