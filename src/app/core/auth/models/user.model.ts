import { Role } from './role.model';

export interface User {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  dateOfBirth: Date;
}
