import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./core/auth/auth.routes').then((r) => r.authRoutes),
  },
  {
    path: 'pets/:id',
    loadChildren: () =>
      import('./features/pet-details/pet-details.routes').then((r) => r.petDetailsRoutes),
  },
];
