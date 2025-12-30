import { Routes } from '@angular/router';
import { WalkApiService } from './services/walk-api.service';

export const walkRoutes: Routes = [
  {
    path: '',
    providers: [WalkApiService],
    children: [
      {
        path: 'sledzenie/:sessionId',
        loadComponent: () =>
          import('./components/track-walk/track-walk.component').then((c) => c.TrackWalkComponent),
      },
      {
        path: ':reservationId',
        loadComponent: () =>
          import('./components/view-walk/view-walk.component').then((c) => c.ViewWalkComponent),
        providers: [WalkApiService],
      },
    ],
  },
];
