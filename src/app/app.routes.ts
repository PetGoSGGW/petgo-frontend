import { Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./core/auth/auth.routes').then((r) => r.authRoutes),
  },
  { path: 'contact', component: ContactComponent },
];
