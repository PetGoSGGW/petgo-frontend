import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { ReservationCardComponent } from './components/reservation-card/reservation-card.component';
import { WalkerReservationsApiService } from './services/walker-reservations-api.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-walker-reservations',
    standalone: true,
    imports: [MatProgressSpinner, MatError, ReservationCardComponent, MatIcon],
    providers: [WalkerReservationsApiService],
    templateUrl: './walker-reservations.component.html',
    styleUrl: './walker-reservations.component.css',
})
export default class WalkerReservationsComponent {
    private readonly reservationsService = inject(WalkerReservationsApiService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    // TODO: Get actual walker ID from auth service
    // For now, using a mock walker ID
    protected readonly reservations = rxResource({
        params: () => ({ walkerId: 1 }),
        stream: ({ params }: { params: { walkerId: number } }) =>
            this.reservationsService.getWalkerReservations$(params.walkerId),
    });

    protected navigateToUser(userId: number): void {
        void this.router.navigate(['/uzytkownik', userId]);
    }

    protected navigateToDog(dogId: number): void {
        void this.router.navigate(['/pies', dogId]);
    }
}
