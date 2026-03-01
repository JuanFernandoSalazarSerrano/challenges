import { useHistory } from 'react-router-dom';
import { setSession } from '../utils/session-store';

export const useLoginPage = () => {
  const history = useHistory();

  const handleLogin = (email: string, password: string) => {
    if (email === 'user@mail.com' && password === '123') {
      setSession(true);
      
      history.push('/tab1');
      return true;
    } else {
      alert('Invalid email or password');
      return false;
    }
  };

    const handleLogOut = () => {
        setSession(false);
        history.push('/login');
        
        window.location.reload();

        return true;
    };

  return { handleLogin, handleLogOut };
};
