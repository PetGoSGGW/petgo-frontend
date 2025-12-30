import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { ReservationApiService } from './serivces/reservation-api.service';
import { DogApiService } from './serivces/dog-api.service';

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
        providers: [ReservationApiService, DogApiService],
      },
      {
        path: 'kontakt',
        loadChildren: () =>
          import('./features/contact/contact.routes').then((r) => r.contactRoutes),
      },
      {
        path: 'spacer',
        loadChildren: () => import('./features/walk/walk.routes').then((r) => r.walkRoutes),
      },
      {
        path: 'oferty',
        loadChildren: () =>
          import('./features/walker-offers/walker-offers.routes').then((r) => r.offersRoutes),
      },
      {
        path: 'pies/:id',
        loadChildren: () =>
        import('./features/pet-details/pet-details.routes').then((r) => r.petDetailsRoutes),
      },
    ],
  },
  {
    path: 'autoryzacja',
    loadChildren: () => import('./core/auth/auth.routes').then((r) => r.authRoutes),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
