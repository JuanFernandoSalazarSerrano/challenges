import { Doctor } from './Doctor';

export class AuthState {
  isLoggedIn: boolean;
  doctor: Doctor | null;
}