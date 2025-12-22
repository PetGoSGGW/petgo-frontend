import { User } from '../core/auth/models/user.model';
import { Dog } from './dog.model';

export interface Reservation {
  reservationId: number;
  scheduledStart: string;
  scheduledEnd: string;
  reservationStatus: ReservationStatus;
  walker: User;
  owner: User;
  dog: Dog;
  createdAt: string;
  updatedAt: string;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
