import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { rxResource } from '@angular/core/rxjs-interop';

import { WalkerOffer } from '../../models/walker-offer.model';
import {
  WalkerOfferReservationDialogComponent,
  WalkerOfferReservationDialogData,
} from '../walker-offer-reservation-dialog/walker-offer-reservation-dialog.component';
import { UserApiService } from '../../../../services/user-api.service';
import { UserReview } from '../../../../models/userReview.model';
import { AvailableSlot } from '../../models/available-slot.model';
import { FromCentsPipe } from '../../../../pipes/from-cents.pipe';
import { LuxonPipe } from '../../../../pipes/luxon.pipe';
import { DateTime } from 'luxon';

export interface WalkerOfferDetailsDialogData {
  offer: WalkerOffer;
  userLocation: { lat: number; lng: number } | null;
}

@Component({
  imports: [
    MatDialogModule,
    MatButton,
    MatDivider,
    DecimalPipe,
    MatIconModule,
    FromCentsPipe,
    LuxonPipe,
  ],
  templateUrl: './walker-offer-details-dialog.component.html',
  styleUrls: ['./walker-offer-details-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalkerOfferDetailsDialogComponent {
  private readonly dialog = inject(MatDialog);
  private readonly data = inject<WalkerOfferDetailsDialogData>(MAT_DIALOG_DATA);
  private readonly userApi = inject(UserApiService);

  protected readonly offer = this.data.offer;
  protected readonly userLocation = this.data.userLocation;

  protected readonly reviewsResource = rxResource({
    stream: () => this.userApi.getUserReviews(this.offer.walkerId),
  });

  protected readonly walkerInfoResource = rxResource({
    stream: () => this.userApi.getUser(this.offer.walkerId),
  });

  protected readonly reviewsList = computed<UserReview[]>(
    () => this.reviewsResource.value()?.reviewDTOList ?? [],
  );

  protected readonly avgRating = computed<number>(
    () => this.reviewsResource.value()?.avgRating ?? 0,
  );

  protected readonly age = computed<number>(() => {
    const birth = this.walkerInfoResource.value()?.dateOfBirth;
    if (!birth) return 0;

    const dob = DateTime.fromISO(birth);
    if (!dob.isValid) return 0;

    return Math.floor(DateTime.now().diff(dob, 'years').years);
  });

  protected getRatingForReview(rating: number, index: number): string {
    if (rating >= index) return 'star';
    if (rating >= index - 0.5) return 'star_half';
    return 'star_border';
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  protected readonly nearestSlot = (): AvailableSlot | null => {
    if (!this.userLocation || !this.offer.slots?.length) return null;

    let nearest: AvailableSlot | null = null;
    let minDistance = Infinity;

    for (const slot of this.offer.slots) {
      if (slot.latitude == null || slot.longitude == null) continue;

      const distance = this.haversineDistance(
        this.userLocation.lat,
        this.userLocation.lng,
        slot.latitude,
        slot.longitude,
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = slot;
      }
    }
    return nearest;
  };

  protected readonly distanceToWalker = (): number | null => {
    if (!this.userLocation) return null;

    const slot = this.nearestSlot();
    if (!slot) return null;

    return this.haversineDistance(
      this.userLocation.lat,
      this.userLocation.lng,
      slot.latitude,
      slot.longitude,
    );
  };

  protected openReservation(): void {
    this.dialog.open(WalkerOfferReservationDialogComponent, {
      width: '600px',
      data: {
        offerId: this.offer.offerId,
        slots: this.offer.slots,
      } satisfies WalkerOfferReservationDialogData,
    });
  }
}
