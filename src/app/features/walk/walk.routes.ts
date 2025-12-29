import { Routes } from '@angular/router';

export const walkRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./walk.component'),
  },
];
