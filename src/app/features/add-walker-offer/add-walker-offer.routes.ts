import { Routes } from '@angular/router';
import { AddWalkerOfferApiService } from './services/add-walker-offer-api.service';

export const addWalkerOfferRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./add-walker-offer.component'),
    providers: [AddWalkerOfferApiService],
  },
];
