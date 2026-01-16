import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Pipe,
  PipeTransform,
  signal,
} from '@angular/core';
import { DogApiService } from '../../services/dog-api.service';
import { ReservationApiService } from '../../services/reservation-api.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { SectionWrapperComponent } from '../../components/section-wrapper/section-wrapper.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { AuthService } from '../../core/auth/services/auth.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { LuxonPipe } from '../../pipes/luxon.pipe';
import { BookedSlot, Reservation } from '../../models/reservation.model';
import { DateTime } from 'luxon';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Pipe({
  name: 'walkDuration',
})
export class WalkDurationPipe implements PipeTransform {
  public transform(reservation: Reservation): string {
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
  }
}

@Pipe({
  name: 'walkLocations',
})
export class WalkLocationsPipe implements PipeTransform {
  public transform({ bookedSlots }: Reservation): BookedSlot[] {
    const seen = new Set<string>();

    return bookedSlots.filter((slot) => {
      const key = `${slot.latitude}-${slot.longitude}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }
}

@Component({
  selector: 'app-walkers-plan',
  templateUrl: './walkers-plan.component.html',
  styleUrl: './walkers-plan.component.css',
  imports: [
    SectionWrapperComponent,
    MatProgressSpinner,
    RouterLink,
    MatButton,
    MatError,
    MatDatepickerModule,
    MatFormField,
    MatHint,
    MatLabel,
    FormsModule,
    MatInput,
    MatSuffix,
    MatChipsModule,
    MatIcon,
    LuxonPipe,
    WalkDurationPipe,
    WalkLocationsPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WalkersPlanComponent {
  private readonly dogApi = inject(DogApiService);
  private readonly reservationApi = inject(ReservationApiService);
  private readonly authService = inject(AuthService);

  protected readonly filterDate = signal<string | null>(null);

  private readonly userId = this.authService.userId;

  protected readonly dogsWithReservations = rxResource({
    params: () => {
      const userId = this.userId();

      if (!userId) return undefined;

      return { userId };
    },
    stream: ({ params: { userId } }) =>
      this.dogApi.getDogsByUserId$(userId).pipe(
        switchMap((dogs) => {
          if (!dogs.length) return of([]);

          return forkJoin(
            dogs.map((dog) =>
              this.reservationApi.getDogReservations$(dog.dogId).pipe(
                map((reservations) => ({
                  ...dog,
                  reservations: reservations.filter(({ status }) => status === 'CONFIRMED'),
                })),
              ),
            ),
          );
        }),
      ),
  });
}
