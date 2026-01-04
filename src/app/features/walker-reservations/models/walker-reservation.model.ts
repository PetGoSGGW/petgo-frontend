import { ReservationStatus } from '../../../models/reservation.model';

export interface WalkerReservation {
    reservationId: number;
    owner: OwnerInfo;
    dog: DogInfo;
    scheduledStart: string;
    scheduledEnd: string;
    priceCents: number;
    distanceKm: number;
    status: ReservationStatus;
}

export interface OwnerInfo {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    rating: number;
    reviewCount: number;
}

export interface DogInfo {
    dogId: number;
    name: string;
    breedName: string;
    size: string;
    weightKg: number;
    photoUrl: string;
}
