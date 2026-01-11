import { Routes } from '@angular/router';
import { UserDetailsComponent } from './user-details.component';
import { WalletApiService } from '../../services/wallet-api.service';
export const userDetailsRoutes: Routes = [
  {
    path: '',
    component: UserDetailsComponent,
    providers: [WalletApiService],
  },
];
