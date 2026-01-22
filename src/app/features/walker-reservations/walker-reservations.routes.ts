import { Routes } from '@angular/router';
import { ReservationApiService } from '../../services/reservation-api.service';
import { WalkerOffersApiService } from '../walker-offers/services/walker-offers-api.service';

export const walkerReservationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./walker-reservations.component'),
    providers: [ReservationApiService, WalkerOffersApiService],
  },
];
