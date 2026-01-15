import { Component, computed, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LuxonPipe } from '../../../pipes/luxon.pipe';
import { ReservationApiService } from '../../../services/reservation-api.service';
import { Reservation, BookedSlot } from '../../../models/reservation.model';
import { User } from '../../../models/user.model';
import { Dog } from '../../../models/dog.model';

interface ReservationDialogData {
  reservation: Reservation;
  owner: User;
  walker: User;
  dog: Dog;
}

@Component({
  standalone: true,
  providers: [ReservationApiService],
  imports: [MatDialogModule, MatButtonModule, LuxonPipe, NgIf],
  templateUrl: './reservation-details-dialog.component.html',
  styleUrls: ['./reservation-details-dialog.component.css'],
})
export class ReservationDetailsDialogComponent {
  public readonly data = inject<ReservationDialogData>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<ReservationDetailsDialogComponent>);
  private readonly router = inject(Router);
  private readonly reservationApi = inject(ReservationApiService);

  public readonly isPendingReservation = computed(() => this.data.reservation.status === 'PENDING');

  public readonly locations = computed<BookedSlot[]>(() => {
    const slots = this.data.reservation.bookedSlots;
    const seen = new Set<string>();

    return slots.filter((slot) => {
      const key = `${slot.latitude}-${slot.longitude}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  });

  public close(): void {
    this.dialogRef.close();
  }

  public cancelReservation(): void {
    this.reservationApi.cancelReservation$(this.data.reservation.reservationId).subscribe({
      next: () => this.dialogRef.close('cancelled'),
      error: () => console.error('Nie udało się anulować rezerwacji'),
    });
  }

  public goToChat(): void {
    this.dialogRef.close();
    this.router.navigate(['/chat', this.data.reservation.reservationId]);
  }
}
