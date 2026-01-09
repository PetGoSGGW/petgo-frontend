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
import { filter, map, tap } from 'rxjs';
import { DateTime } from 'luxon';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { WalkerOfferMapComponent } from './components/walker-offer-map/walker-offer-map.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/divider';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FromCentsPipe } from '../../pipes/from-cents.pipe';
import { LocationService } from '../../services/location.service';
import { SectionWrapperComponent } from '../../components/section-wrapper/section-wrapper.component';

@Component({
  selector: 'app-walker-offers',
  imports: [
    FormsModule,
    MatProgressSpinner,
    MatButton,
    RouterLink,
    DatePipe,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatPaginator,
    WalkerOfferMapComponent,
    MatIcon,
    MatTooltipModule,
    MatDivider,
    MatSlideToggle,
    FromCentsPipe,
    SectionWrapperComponent,
  ],
  templateUrl: './walker-offers.component.html',
  styleUrl: './walker-offers.component.css',
})
export class WalkerOffersComponent {
  private readonly offersService = inject(WalkerOffersApiService);
  private readonly dialog = inject(MatDialog);
  private readonly locationService = inject(LocationService);

  protected readonly loading = signal(true);

  protected readonly location = toSignal(
    this.locationService.getCurrentLocation$().pipe(
      map(({ latitude, longitude }) => ({ lat: latitude, lng: longitude })),
      filter((coordinates) => !!coordinates),
      tap(() => this.loading.set(false)),
    ),
  );

  protected readonly radius = signal<number>(2);

  protected offers = rxResource({
    params: () => {
      const location = this.location();

      if (!location) return undefined;

      return {
        radius: this.radius(),
        coordinates: location,
        page: this.page() - 1,
      };
    },
    stream: ({ params: { radius, coordinates, page } }) =>
      this.offersService
        .getOffers({
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          radiusKm: radius,
          page,
        })
        .pipe(
          map((response) => ({
            ...response,
            content: response.content.map((offer) => ({
              ...offer,
              slots:
                offer.slots?.filter((s) => DateTime.fromISO(s.startTime) > DateTime.now()) ?? [],
            })),
          })),
          map((response) => ({
            ...response,
            content: response.content.filter((offer) => offer.slots.length > 0),
          })),
        ),
  });

  protected readonly shouldShowMap = signal(true);

  protected readonly total = computed(() =>
    this.offers.hasValue() ? this.offers.value().totalElements : 0,
  );

  protected readonly count = computed(() =>
    this.offers.hasValue() ? this.offers.value().number : 0,
  );
  protected readonly page = signal(1);
  protected readonly size = signal(10).asReadonly();

  protected openReservationDialog({ offerId, slots }: WalkerOffer): void {
    this.dialog
      .open(WalkerOfferReservationDialogComponent, {
        width: '600px',
        data: {
          offerId,
          slots,
        } satisfies WalkerOfferReservationDialogData,
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.offers.reload());
  }
}
