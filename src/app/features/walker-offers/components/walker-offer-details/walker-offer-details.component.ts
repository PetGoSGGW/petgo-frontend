import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WalkerOffer } from '../../models/walker-offer.model';

@Component({
  selector: 'app-walker-offer-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: ``,
})
export class WalkerOfferDetailsComponent {
  public readonly offerId = input.required<WalkerOffer['offerId']>();
}
