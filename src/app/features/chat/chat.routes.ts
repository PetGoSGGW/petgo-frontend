import { Routes } from '@angular/router';
export const chatRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/chats/chats.component'),
  },
  {
    path: ':reservationId',
    loadComponent: () => import('./components/chat/chat.component'),
  },
];
