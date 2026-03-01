import { ReactNode, useSyncExternalStore } from 'react';
import { getSnapshot, subscribe } from '../utils/session-store';
import { Redirect } from 'react-router-dom';

type Props = { children?: ReactNode };

export const PrivateRoute = ({ children }: Props) => {
  const session = useSyncExternalStore(subscribe, getSnapshot);
  if (!session) return <Redirect to="/login" />;
  return <>{children}</>;
};
