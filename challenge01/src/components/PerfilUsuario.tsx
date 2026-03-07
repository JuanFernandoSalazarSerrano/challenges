import { User } from '../models/user';

interface PerfilUsuarioProps {
  user: User;
  onLogout: () => void;
}

export function PerfilUsuario({ user, onLogout }: PerfilUsuarioProps) {
  const initials = user.name
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="text-lg font-semibold">Perfil</h3>
      <div className="flex items-center mt-2">
        {user.avatar ? (
          <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
            {initials}
          </div>
        )}
        <div>
          <p>{user.name}</p>
          <p className="text-sm text-gray-600">{user.role}</p>
        </div>
      </div>
      <button onClick={onLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
}