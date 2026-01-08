import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ReservationApiService } from '../../../../services/reservation-api.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatList, MatListItem, MatListItemAvatar, MatListItemTitle } from '@angular/material/list';
import { SectionWrapperComponent } from '../../../../components/section-wrapper/section-wrapper.component';
import { LuxonPipe } from '../../../../pipes/luxon.pipe';

@Component({
  selector: 'app-home-completed-walk-list',
  templateUrl: './home-completed-walk-list.component.html',
  styleUrl: './home-completed-walk-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinner,
    MatList,
    MatListItem,
    MatListItemAvatar,
    MatListItemTitle,
    LuxonPipe,
    SectionWrapperComponent,
  ],
})
export class HomeCompletedWalkListComponent {
  private readonly authService = inject(AuthService);
  private readonly reservationApi = inject(ReservationApiService);

  protected readonly userId = computed(() => this.authService.session()?.userId);

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
}
