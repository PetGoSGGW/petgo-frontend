import { Routes } from '@angular/router';

export const walkersPlanRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./walkers-plan.component'),
  },
];
