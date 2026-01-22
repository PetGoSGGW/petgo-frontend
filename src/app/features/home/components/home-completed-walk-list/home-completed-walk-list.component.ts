import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ReservationApiService } from '../../../../services/reservation-api.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SectionWrapperComponent } from '../../../../components/section-wrapper/section-wrapper.component';
import { ReservationCardComponent } from '../../../../components/reservation-card/reservation-card.component';
import { ReservationGridComponent } from '../../../../components/reservation-grid/reservation-grid.component';
import {
  ReviewDialogComponent,
  ReviewDialogData,
} from '../../../../components/review-dialog/review-dialog.component';
import { Reservation } from '../../../../models/reservation.model';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-completed-walk-list',
  templateUrl: './home-completed-walk-list.component.html',
  styleUrl: './home-completed-walk-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinner,
    MatButton,
    SectionWrapperComponent,
    ReservationCardComponent,
    ReservationGridComponent,
  ],
})
export class HomeCompletedWalkListComponent {
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly reservationApi = inject(ReservationApiService);
  private readonly router = inject(Router);

  protected readonly userId = computed(() => this.authService.session()?.userId);

  protected completedWalks = rxResource({
    stream: () =>
      this.reservationApi
        .getReservations$()
        .pipe(
          map((reservations) =>
            reservations.filter((reservation) => reservation.status === 'COMPLETED'),
          ),
        ),
  });

  protected openReviewDialog(reservationId: Reservation['reservationId']) {
    this.dialog.open(ReviewDialogComponent, {
      data: {
        type: 'WALKER',
        reservationId,
      } satisfies ReviewDialogData,
    });
  }

  protected openCompletedDetails(reservationId: Reservation['reservationId']): void {
    void this.router.navigate(['/spacer/szczegoly', reservationId]);
  }
}
