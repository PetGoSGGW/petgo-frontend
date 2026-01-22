import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { ReservationCardComponent } from '../../components/reservation-card/reservation-card.component';
import { MatIcon } from '@angular/material/icon';
import { SectionWrapperComponent } from '../../components/section-wrapper/section-wrapper.component';
import { ReservationApiService } from '../../services/reservation-api.service';
import { DogApiService } from '../../services/dog-api.service';
import { ReservationGridComponent } from '../../components/reservation-grid/reservation-grid.component';
import { Reservation } from '../../models/reservation.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../core/auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import {
  ReviewDialogComponent,
  ReviewDialogData,
} from '../../components/review-dialog/review-dialog.component';
import { ReviewType } from '../../models/review-type.model';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-walker-reservations',
  imports: [
    MatProgressSpinner,
    MatError,
    ReservationCardComponent,
    MatIcon,
    SectionWrapperComponent,
    ReservationGridComponent,
    MatButton,
    MatTabsModule,
  ],
  templateUrl: './walker-reservations.component.html',
  styleUrl: './walker-reservations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WalkerReservationsComponent {
  private readonly reservationApi = inject(ReservationApiService);
  protected readonly dogApi = inject(DogApiService);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  protected readonly loading = signal<Reservation['reservationId'] | null>(null);

  protected readonly userId = this.authService.userId;

  protected readonly ownerReservations = rxResource({
    stream: () =>
      this.reservationApi
        .getReservations$()
        .pipe(map((reservations) => reservations.sort((a, b) => b.status.localeCompare(a.status)))),
  });

  protected readonly walkerReservations = rxResource({
    stream: () =>
      this.reservationApi
        .getWalkerReservations$()
        .pipe(map((reservations) => reservations.sort((a, b) => b.status.localeCompare(a.status)))),
  });

  protected cancel(reservationId: Reservation['reservationId']): void {
    this.loading.set(reservationId);

    this.reservationApi.cancel$(reservationId).subscribe({
      next: () => {
        this.loading.set(null);
        this.matSnackBar.open('Anulowano', 'OK');
        this.walkerReservations.reload();
      },
      error: () => {
        this.loading.set(null);
        this.matSnackBar.open('Wystąpił błąd!', 'OK');
      },
    });
  }

  protected confirm(reservationId: Reservation['reservationId']): void {
    this.loading.set(reservationId);

    this.reservationApi.confirm$(reservationId).subscribe({
      next: () => {
        this.loading.set(null);
        this.matSnackBar.open('Potwierdzono', 'OK');
        this.walkerReservations.reload();
      },
      error: () => {
        this.loading.set(null);
        this.matSnackBar.open('Wystąpił błąd!', 'OK');
      },
    });
  }

  protected openReviewDialog(reservationId: Reservation['reservationId'], type: ReviewType) {
    this.dialog.open(ReviewDialogComponent, {
      data: {
        type,
        reservationId,
      } satisfies ReviewDialogData,
      width: '600px',
    });
  }

  protected openCompletedDetails(reservationId: Reservation['reservationId']): void {
    void this.router.navigate(['/spacer/szczegoly', reservationId]);
  }

  protected startWalk(reservationId: Reservation['reservationId']): void {
    void this.router.navigate(['/spacer/sledzenie', reservationId]);
  }
}
