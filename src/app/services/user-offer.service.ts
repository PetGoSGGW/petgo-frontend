import { computed, inject, Injectable } from '@angular/core';
import { UserOfferApiService } from './user-offer-api.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable()
export class UserOfferService {
  private readonly userOfferApi = inject(UserOfferApiService);

  private offerResource = rxResource({
    stream: () => this.userOfferApi.getUserOffer$(),
  });

  public readonly loading = this.offerResource.isLoading;
  public readonly offer = computed(() =>
    this.offerResource.hasValue() ? this.offerResource.value() : null,
  );
  public readonly error = this.offerResource.error;

  public readonly hasOffer = computed(() => !this.loading() && !!this.offer() && !this.error());

  public reload(): void {
    this.offerResource.reload();
  }
}
