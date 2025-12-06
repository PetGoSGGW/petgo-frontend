import { Role } from './role.model';

export interface Session {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  role: Role;
}
