import { Component, computed, inject, input } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { Reservation } from '../../../../models/reservation.model';
import { RouterLink } from '@angular/router';
import { UserApiService } from '../../../../services/user-api.service';
import { DogApiService } from '../../../../services/dog-api.service';
import { WalkerOffersApiService } from '../../../walker-offers/services/walker-offers-api.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';

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
    DatePipe,
    RouterLink,
    MatProgressSpinner,
    MatError,
  ],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.css',
})
export class ReservationCardComponent {
  private readonly userApi = inject(UserApiService);
  private readonly dogApi = inject(DogApiService);
  private readonly walkerOfferApi = inject(WalkerOffersApiService);

  public readonly reservation = input.required<Reservation>();

  protected readonly walkDuration = computed(() => {
    const res = this.reservation();
    const start = new Date(res.scheduledStart);
    const end = new Date(res.scheduledEnd);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / 1000 / 60);

    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    }

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}min`;
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
}
