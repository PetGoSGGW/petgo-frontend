import { Routes } from '@angular/router';

export const offersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./offers.component').then((c) => c.OffersComponent),
  },
];
