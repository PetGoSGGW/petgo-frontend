import { Routes } from '@angular/router';

export const contactRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/contact/contact.component').then((c) => c.ContactComponent),
  },
];
