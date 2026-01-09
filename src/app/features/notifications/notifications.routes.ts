import { Routes } from '@angular/router';
import { NotificationsApiService } from './services/notifications-api.service';

export const notificationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./notifications.component').then((c) => c.NotificationsComponent),
    providers: [NotificationsApiService],
  },
];
