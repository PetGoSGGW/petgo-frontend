import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserOfferService } from '../services/user-offer.service';

export const userOfferResolverFn: ResolveFn<void> = () => {
  const userOfferService = inject(UserOfferService);

  userOfferService.reload();
};
