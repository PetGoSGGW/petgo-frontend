import { Routes } from '@angular/router';
import { AuthApiService } from './services/auth-api.service';
export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth.component').then((c) => c.AuthComponent),
    children: [
      {
        path: 'logowanie',
        loadComponent: () =>
          import('./components/log-in-form/log-in-form').then(
            (c) => c.LogInFormComponent,
      )
      },
      {
        path: 'rejestracja',
        loadComponent: () =>
          import('./components/sign-up-form/sign-up-form.component').then(
            (c) => c.SignUpFormComponent,
          ),
      },
    ],
    providers: [AuthApiService],
  },
  {
    path: '**',
    redirectTo: 'rejestracja',
  },
];
