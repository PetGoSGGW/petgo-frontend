import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./core/auth/auth.routes').then((r) => r.authRoutes),
  },
  {
    path: 'offers',
    loadChildren: () =>
      import('./offers/offers.routes').then((r) => r.offersRoutes),
  },
];
