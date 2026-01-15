import { Component, computed, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LuxonPipe } from '../../../pipes/luxon.pipe';
import { ReservationApiService } from '../../../services/reservation-api.service';
import { Reservation, BookedSlot } from '../../../models/reservation.model';
import { User } from '../../../models/user.model';
import { Dog } from '../../../models/dog.model';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ReservationDialogData {
  reservation: Reservation;
  owner: User;
  walker: User;
  dog: Dog;
}

@Component({
  standalone: true,
  providers: [ReservationApiService],
  imports: [MatDialogModule, MatButtonModule, LuxonPipe, RouterLink],
  templateUrl: './reservation-details-dialog.component.html',
  styleUrls: ['./reservation-details-dialog.component.css'],
})
export class ReservationDetailsDialogComponent {
  public readonly data = inject<ReservationDialogData>(MAT_DIALOG_DATA);

  protected readonly dialogRef = inject(MatDialogRef<ReservationDetailsDialogComponent>);
  private readonly reservationApi = inject(ReservationApiService);
  private readonly matSnackBar = inject(MatSnackBar);

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
    this.reservationApi.cancel$(this.data.reservation.reservationId).subscribe({
      next: () => {
        this.dialogRef.close('cancelled');
        this.matSnackBar.open('Anulowano rezerwację', 'OK');
      },
      error: () => this.matSnackBar.open('Nie udało się anulować rezerwacji', 'OK'),
    });
  }
}
