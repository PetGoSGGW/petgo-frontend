import { Component, computed, input, output } from '@angular/core';
import { WalkerReservation } from '../../models/walker-reservation.model';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { RatingDisplayComponent } from '../../../../components/rating-display/rating-display.component';

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
        RatingDisplayComponent,
    ],
    templateUrl: './reservation-card.component.html',
    styleUrl: './reservation-card.component.css',
})
export class ReservationCardComponent {
    public readonly reservation = input.required<WalkerReservation>();
    public readonly ownerClicked = output<number>();
    public readonly dogClicked = output<number>();

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
        const status = this.reservation().status;
        const labels: Record<string, string> = {
            PENDING: 'Oczekująca',
            CONFIRMED: 'Potwierdzona',
            COMPLETED: 'Ukończona',
            CANCELLED: 'Anulowana',
        };
        return labels[status] || status;
    });

    protected readonly statusClass = computed(() => {
        const status = this.reservation().status;
        const classes: Record<string, string> = {
            PENDING: 'status-pending',
            CONFIRMED: 'status-confirmed',
            COMPLETED: 'status-completed',
            CANCELLED: 'status-cancelled',
        };
        return classes[status] || '';
    });

    protected onOwnerClick(): void {
        this.ownerClicked.emit(this.reservation().owner.userId);
    }

    protected onDogClick(): void {
        this.dogClicked.emit(this.reservation().dog.dogId);
    }
}
