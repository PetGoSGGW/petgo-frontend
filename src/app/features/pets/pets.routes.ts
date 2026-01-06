import { Routes } from '@angular/router';

export const petsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pets.component').then((c) => c.PetsComponent),
  },
];
