import { User } from '../core/auth/models/user.model';
import { WalkerOffer } from '../features/walker-offers/models/walker-offer.model';
import { Dog } from './dog.model';

export interface Reservation {
  reservationId: number;
  scheduledStart: string;
  scheduledEnd: string;
  status: ReservationStatus;
  walkerId: User['userId'];
  ownerId: User['userId'];
  dogId: Dog['dogId'];
  offerId: WalkerOffer['walkerId'];
  createdAt: string;
  updatedAt: string;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
