import { Component, computed, inject, input } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ReservationDetailsDialogComponent } from './reservation-details-dialog/reservation-details-dialog.component';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { UserApiService } from '../../services/user-api.service';
import { DogApiService } from '../../services/dog-api.service';
import { Reservation } from '../../models/reservation.model';
import { LuxonPipe } from '../../pipes/luxon.pipe';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatChipSet,
    MatChip,
    MatIcon,
    RouterLink,
    MatProgressSpinner,
    MatError,
    LuxonPipe,
  ],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.css',
})
export class ReservationCardComponent {
  private readonly userApi = inject(UserApiService);
  private readonly dogApi = inject(DogApiService);
  private readonly dialog = inject(MatDialog);

  public readonly reservation = input.required<Reservation>();

  protected readonly locations = computed(() => {
    const slots = this.reservation().bookedSlots;

    const seen = new Set<string>();

    return slots.filter((slot) => {
      const key = `${slot.latitude}-${slot.longitude}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  });

  protected readonly walkDuration = computed(() => {
    const reservation = this.reservation();

    const start = DateTime.fromISO(reservation.scheduleStart).startOf('minute');
    const end = DateTime.fromISO(reservation.scheduleEnd).startOf('minute');

    const diff = end.diff(start, ['hours', 'minutes']);
    const { hours, minutes } = diff.toObject();

    if (hours === 0) {
      return `${minutes}m`;
    }

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  });

  protected readonly statusLabel = computed(() => {
    const { status } = this.reservation();
    const labels: Record<string, string> = {
      PENDING: 'Oczekująca',
      CONFIRMED: 'Potwierdzona',
      COMPLETED: 'Ukończona',
      CANCELLED: 'Anulowana',
    };
    return labels[status] || status;
  });

  protected readonly statusClass = computed(() => {
    const { status } = this.reservation();

    const classes: Record<string, string> = {
      PENDING: 'status-pending',
      CONFIRMED: 'status-confirmed',
      COMPLETED: 'status-completed',
      CANCELLED: 'status-cancelled',
    };

    return classes[status] || '';
  });

  protected owner = rxResource({
    params: () => ({ id: this.reservation().ownerId }),
    stream: ({ params: { id } }) => this.userApi.getUser(id),
  });

  protected walker = rxResource({
    params: () => ({ id: this.reservation().walkerId }),
    stream: ({ params: { id } }) => this.userApi.getUser(id),
  });

  protected dog = rxResource({
    params: () => ({ id: this.reservation().dogId }),
    stream: ({ params: { id } }) => this.dogApi.getDog$(id),
  });

  protected openDetails(): void {
    this.dialog.open(ReservationDetailsDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        reservation: this.reservation(),
        owner: this.owner.value(),
        walker: this.walker.value(),
        dog: this.dog.value(),
      },
    });
  }
}
