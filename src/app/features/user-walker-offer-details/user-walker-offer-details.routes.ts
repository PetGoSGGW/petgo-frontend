import { Routes } from '@angular/router';
import { UserWalkerOfferDetailsApiService } from './services/user-walker-offer-details-api.service';

export const userWalkerOfferDetails: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-walker-offer-details.component'),
    providers: [UserWalkerOfferDetailsApiService],
  },
];
