import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { ReservationApiService } from './services/reservation-api.service';
import { DogApiService } from './services/dog-api.service';
import { UserOfferService } from './services/user-offer.service';
import { UserOfferApiService } from './services/user-offer-api.service';
import { userOfferResolverFn } from './resolvers/user-offer.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component'),
    canActivate: [authGuard],
    resolve: { offerResolverFn: userOfferResolverFn },
    providers: [UserOfferService, UserOfferApiService],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./features/home/home.routes').then((r) => r.homeRoutes),
        providers: [ReservationApiService, DogApiService],
      },
      {
        path: 'kontakt',
        loadChildren: () =>
          import('./features/contact/contact.routes').then((r) => r.contactRoutes),
      },
      {
        path: 'powiadomienia',
        loadChildren: () =>
          import('./features/notifications/notifications.routes').then(
            (r) => r.notificationsRoutes,
          ),
      },
      {
        path: 'spacer',
        loadChildren: () => import('./features/walk/walk.routes').then((r) => r.walkRoutes),
      },
      {
        path: 'oferty',
        loadChildren: () =>
          import('./features/walker-offers/walker-offers.routes').then((r) => r.offersRoutes),
      },
      {
        path: 'pupile',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadChildren: () => import('./features/pets/pets.routes').then((r) => r.petsRoutes),
          },
          {
            path: ':id',
            loadChildren: () =>
              import('./features/pet-details/pet-details.routes').then((r) => r.petDetailsRoutes),
          },
        ],
      },
      {
        path: 'uzytkownik',
        children: [
          {
            path: 'lista',
            loadChildren: () =>
              import('./features/user-list/user-list.routes').then((r) => r.userListRoutes),
          },
          {
            path: ':id',
            loadChildren: () =>
              import('./features/user-details/user-details.routes').then(
                (r) => r.userDetailsRoutes,
              ),
          },
          {
            path: '**',
            redirectTo: 'lista',
          },
        ],
      },
      {
        path: 'dodaj-spacer',
        loadChildren: () =>
          import('./features/add-walker-offer/add-walker-offer.routes').then(
            (r) => r.addWalkerOfferRoutes,
          ),
      },
      {
        path: 'moja-oferta',
        loadChildren: () =>
          import('./features/user-walker-offer-details/user-walker-offer-details.routes').then(
            (r) => r.userWalkerOfferDetails,
          ),
      },
      {
        path: 'umowione-spacery',
        loadChildren: () =>
          import('./features/walker-reservations/walker-reservations.routes').then(
            (r) => r.walkerReservationsRoutes,
          ),
      },
      {
        path: 'czat',
        loadChildren: () => import('./features/chat/chat.routes').then((r) => r.chatRoutes),
      },
    ],
  },
  {
    path: 'autoryzacja',
    loadChildren: () => import('./core/auth/auth.routes').then((r) => r.authRoutes),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
