import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { DatePipe, DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { WalkerOffer } from '../../models/walker-offer.model';
import {
  WalkerOfferReservationDialogComponent,
  WalkerOfferReservationDialogData,
} from '../walker-offer-reservation-dialog/walker-offer-reservation-dialog.component';
import { UserApiService } from '../../../../services/user-api.service';
import { UserReview } from '../../../../models/userReview.model';
import { AvailableSlot } from '../../models/available-slot.model';

export interface WalkerOfferDetailsDialogData {
  offer: WalkerOffer;
  userLocation: {
    lat: number;
    lng: number;
  } | null;
}

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButton, MatDivider, DatePipe, DecimalPipe, MatIconModule],
  templateUrl: './walker-offer-details-dialog.component.html',
  styleUrls: ['./walker-offer-details-dialog.component.css'],
})
export class WalkerOfferDetailsDialogComponent {
  private readonly dialog = inject(MatDialog);
  private readonly data = inject<WalkerOfferDetailsDialogData>(MAT_DIALOG_DATA);
  private readonly userApi = inject(UserApiService);

  protected readonly offer = this.data.offer;
  protected readonly userLocation = this.data.userLocation;

  protected getRatingForReview(rating: number, index: number): string {
    if (rating >= index) {
      return 'star';
    } else if (rating >= index - 0.5) {
      return 'star_half';
    } else {
      return 'star_border';
    }
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (value: number) => (value * Math.PI) / 180;

    const R = 6371; // promień Ziemi w km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  protected readonly nearestSlot = (): AvailableSlot | null => {
    if (!this.userLocation || !this.offer.slots?.length) {
      return null;
    }

    let nearest: AvailableSlot | null = null;
    let minDistance = Infinity;

    for (const slot of this.offer.slots) {
      if (slot.latitude == null || slot.longitude == null) {
        continue;
      }

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
    if (!this.userLocation) {
      return null;
    }

    const slot = this.nearestSlot();
    if (!slot) {
      return null;
    }

    return this.haversineDistance(
      this.userLocation.lat,
      this.userLocation.lng,
      slot.latitude,
      slot.longitude,
    );
  };

  // response z backendu
  protected readonly reviewsResponse = toSignal(this.userApi.getUserReviews(this.offer.walkerId));

  protected readonly walkerInfoResponse = toSignal(this.userApi.getUser(this.offer.walkerId));

  // helpery do template
  protected readonly reviewsList = (): UserReview[] => this.reviewsResponse()?.reviewDTOList ?? [];

  protected readonly avgRating = (): number => this.reviewsResponse()?.avgRating ?? 0;

  protected readonly age = (): number => {
    const birth = this.walkerInfoResponse()?.dateOfBirth;
    if (!birth) {
      return 0;
    }

    const dob = new Date(birth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
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
