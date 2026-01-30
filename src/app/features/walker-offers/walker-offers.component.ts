import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WalkerOffersApiService } from './services/walker-offers-api.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { WalkerOffer } from './models/walker-offer.model';
import { AvailableSlot } from './models/available-slot.model';
import {
  WalkerOfferReservationDialogComponent,
  WalkerOfferReservationDialogData,
} from './components/walker-offer-reservation-dialog/walker-offer-reservation-dialog.component';
import {
  WalkerOfferDetailsDialogComponent,
  WalkerOfferDetailsDialogData,
} from './components/walker-offer-details-dialog/walker-offer-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, tap } from 'rxjs';
import { DateTime } from 'luxon';
import { RouterLink } from '@angular/router';
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
import { AuthService } from '../../core/auth/services/auth.service';
import { LuxonPipe } from '../../pipes/luxon.pipe';

@Component({
  selector: 'app-walker-offers',
  imports: [
    FormsModule,
    MatProgressSpinner,
    MatButton,
    RouterLink,
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
    LuxonPipe,
  ],
  templateUrl: './walker-offers.component.html',
  styleUrl: './walker-offers.component.css',
})
export class WalkerOffersComponent {
  private readonly offersService = inject(WalkerOffersApiService);
  private readonly dialog = inject(MatDialog);
  private readonly locationService = inject(LocationService);
  private readonly authService = inject(AuthService);

  private readonly userId = this.authService.userId;

  protected readonly loading = signal(true);

  protected readonly location = toSignal(
    this.locationService.getCurrentLocation$().pipe(
      map(({ latitude, longitude }) => ({ lat: latitude, lng: longitude })),
      filter((coordinates) => !!coordinates),
      tap(() => this.loading.set(false)),
    ),
  );

  protected readonly pageIndex = signal(0);
  protected readonly size = signal(10).asReadonly();
  protected readonly radius = signal<number>(2);

  protected offers = rxResource({
    params: () => {
      const location = this.location();

      if (!location) return undefined;

      return {
        radius: this.radius(),
        coordinates: location,
        page: this.pageIndex(),
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
              slots: this.filterAvailableSlots(offer.slots ?? [], radius, coordinates),
            })),
          })),
          map((response) => ({
            ...response,
            content: response.content.filter(
              (offer) => offer.slots.length > 0 && offer.walkerId !== this.userId(),
            ),
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

  protected openDetailsDialog(offer: WalkerOffer): void {
    const location = this.location();

    this.dialog.open(WalkerOfferDetailsDialogComponent, {
      width: '700px',
      data: { offer, userLocation: location ?? null } satisfies WalkerOfferDetailsDialogData,
    });
  }

  private filterAvailableSlots(
    slots: AvailableSlot[],
    radiusKm: number,
    coordinates: { lat: number; lng: number },
  ): AvailableSlot[] {
    if (!coordinates) {
      return slots;
    }

    return slots.filter(
      (slot) =>
        DateTime.fromISO(slot.startTime) > DateTime.now().plus({ day: 1 }) &&
        this.isSlotWithinRadius(slot, coordinates, radiusKm),
    );
  }

  private isSlotWithinRadius(
    slot: AvailableSlot,
    coordinates: { lat: number; lng: number },
    radiusKm: number,
  ): boolean {
    const distanceKm = this.calculateDistanceKm(
      slot.latitude,
      slot.longitude,
      coordinates.lat,
      coordinates.lng,
    );

    return distanceKm <= radiusKm;
  }

  private calculateDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRadians = (value: number): number => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;

    const deltaLat = toRadians(lat2 - lat1);
    const deltaLng = toRadians(lng2 - lng1);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  }
}
