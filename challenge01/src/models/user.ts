export class User {
  email: string;
  password: string;
  name: string;
  role: 'recepcionista' | 'medico';
  avatar?: string;
}