import { Role } from './role.model';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  dateOfBirth?: string;
}
