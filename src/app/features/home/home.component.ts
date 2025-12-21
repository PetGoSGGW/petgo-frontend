import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/auth/services/auth.service';
import { DogApiService } from '../../serivces/dog-api.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ReservationApiService } from '../../serivces/reservation-api.service';
import { map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [MatProgressSpinner, MatButton, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  private readonly authService = inject(AuthService);
  private readonly dogApi = inject(DogApiService);
  private readonly reservationApi = inject(ReservationApiService);
  private readonly matDialog = inject(MatDialog);

  protected readonly userId = computed(() => this.authService.session()?.userId);

  protected dogs = rxResource({
    params: () => ({ userId: this.userId() }),
    stream: ({ params: { userId } }) => this.dogApi.getDogs$(userId ?? -1),
  });

  protected completedWalks = rxResource({
    stream: () =>
      this.reservationApi
        .getReservations$()
        .pipe(
          map((reservations) =>
            reservations.filter((reservation) => reservation.reservationStatus === 'COMPLETED'),
          ),
        ),
  });

  protected openAddDogDialog(): void {
    // this.matDialog.open();
  }
}
