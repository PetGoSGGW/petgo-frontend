import { Routes } from '@angular/router';
import { WalkerOffersApiService } from './services/walker-offers-api.service';

export const offersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./walker-offers.component').then((c) => c.WalkerOffersComponent),
    providers: [WalkerOffersApiService],
  },
];
