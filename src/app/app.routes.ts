import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./core/auth/auth.routes').then((r) => r.authRoutes),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./notifications/notifications.routes').then((r) => r.notificationsRoutes),
  },
];
