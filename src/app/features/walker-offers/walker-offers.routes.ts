import { Routes } from '@angular/router';
import { WalkerOffersService } from './services/walker-offers.service';

export const offersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./walker-offers.component').then((c) => c.OffersComponent),
    providers: [WalkerOffersService],
  },
];
