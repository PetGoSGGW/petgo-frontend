import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WalkerOffersApiService } from './services/walker-offers-api.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { WalkerOffer } from './models/walker-offer.model';
import {
  WalkerOfferReservationDialogComponent,
  WalkerOfferReservationDialogData,
} from './components/walker-offer-reservation-dialog/walker-offer-reservation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { filter, map } from 'rxjs';
import { MatList, MatListItem, MatListItemLine, MatListItemTitle } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LocationService } from '../../serivces/location.service';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-walker-offers',
  imports: [
    FormsModule,
    MatProgressSpinner,
    MatButton,
    MatList,
    MatListItem,
    MatListItemTitle,
    MatListItemLine,
    RouterLink,
    DatePipe,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatPaginator,
  ],
  templateUrl: './walker-offers.component.html',
  styleUrl: './walker-offers.component.css',
})
export class OffersComponent {
  private readonly offersService = inject(WalkerOffersApiService);
  private readonly dialog = inject(MatDialog);
  private readonly locationService = inject(LocationService);

  protected readonly location = toSignal(
    this.locationService.getCurrentLocation$().pipe(
      map(({ latitude, longitude }) => ({ latitude, longitude })),
      filter((coordinates) => !!coordinates),
    ),
    {
      initialValue: { latitude: 0, longitude: 0 },
    },
  );

  protected readonly radius = signal<number>(0);

  protected offers = rxResource({
    params: () => ({ radius: this.radius(), coordinates: this.location() }),
    stream: ({ params: { radius, coordinates } }) =>
      this.offersService.getOffers({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        radiusKm: radius,
      }),
  });

  protected readonly total = computed(() =>
    this.offers.hasValue() ? this.offers.value().totalElements : 0,
  );

  protected openReservationDialog({ offerId, slots }: WalkerOffer): void {
    this.dialog
      .open(WalkerOfferReservationDialogComponent, {
        data: {
          offerId,
          slots,
        } satisfies WalkerOfferReservationDialogData,
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe();
  }
}
