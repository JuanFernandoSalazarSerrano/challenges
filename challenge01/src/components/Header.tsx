import { User } from '../models/user';
import { PerfilUsuario } from './PerfilUsuario';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const initials = user.name

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">MediCare+</h1>
      <div className="flex items-center">
        {user.avatar ? (
          <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center mr-2">
            {initials}
          </div>
        )}
        <PerfilUsuario user={user} onLogout={onLogout} />
      </div>
    </header>
  );
}