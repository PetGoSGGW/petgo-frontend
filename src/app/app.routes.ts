import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component'),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./features/home/home.routes').then((r) => r.homeRoutes),
      },
    ],
  },
  {
    path: 'autoryzacja',
    loadChildren: () => import('./core/auth/auth.routes').then((r) => r.authRoutes),
  },
  {
    path: 'offers',
    loadChildren: () => import('./offers/offers.routes').then((r) => r.offersRoutes),
    path: '**',
    redirectTo: '/',
  },
];
