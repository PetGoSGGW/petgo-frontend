import { Routes } from '@angular/router';
import { DogApiService } from '../../serivces/dog-api.service';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component'),
    providers: [DogApiService],
  },
];
