import { User } from '../core/auth/models/user.model';

export interface Dog {
  dogId: number;
  owner: User;
  breed: string;
  name: string;
  notes?: string;
  size?: string;
  weightKg?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
