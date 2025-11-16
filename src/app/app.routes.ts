import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./core/auth/auth.routes').then((r) => r.authRoutes),
  },
  {
    path: 'contact',
    loadChildren: () => import('./features/contact/contact.routes').then((r) => r.contactRoutes),
  },
];
