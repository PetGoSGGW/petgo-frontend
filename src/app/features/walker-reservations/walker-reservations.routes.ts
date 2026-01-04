import { Routes } from '@angular/router';

export const walkerReservationsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./walker-reservations.component'),
    },
];
