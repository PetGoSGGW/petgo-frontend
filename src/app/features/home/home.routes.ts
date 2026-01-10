import { Routes } from '@angular/router';
import { DogApiService } from '../../services/dog-api.service';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component'),
    providers: [DogApiService],
  },
];
