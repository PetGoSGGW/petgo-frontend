import { User } from '../core/auth/models/user.model';
import { WalkerOffer } from '../features/walker-offers/models/walker-offer.model';
import { Dog } from './dog.model';

export interface Reservation {
  reservationId: number;
  scheduleStart: string;
  scheduleEnd: string;
  status: ReservationStatus;
  walkerId: User['userId'];
  ownerId: User['userId'];
  dogId: Dog['dogId'];
  offerId: WalkerOffer['walkerId'];
  createdAt: string;
  updatedAt: string;
  bookedSlots: BookedSlot[];
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface BookedSlot {
  slotId: number;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  isReserved: boolean;
}
