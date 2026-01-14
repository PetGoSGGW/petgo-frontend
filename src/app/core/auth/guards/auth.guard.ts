import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const { isAuthenticated } = inject(AuthService);
  const router = inject(Router);

  return isAuthenticated() || router.createUrlTree(['/autoryzacja/rejestracja']);
};
