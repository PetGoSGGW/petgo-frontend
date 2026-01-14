import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DogApiService } from '../../services/dog-api.service';
import { ReservationApiService } from '../../services/reservation-api.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { SectionWrapperComponent } from '../../components/section-wrapper/section-wrapper.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-walkers-plan',
  templateUrl: './walkers-plan.component.html',
  styles: './walkers-plan.component.css',
  imports: [SectionWrapperComponent, MatProgressSpinner, MatError],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WalkersPlanComponent {
  private readonly dogApi = inject(DogApiService);
  private readonly reservationApi = inject(ReservationApiService);

  protected readonly dogsWithReservations = rxResource({
    stream: () =>
      this.dogApi.getDogs$().pipe(
        switchMap((dogs) => {
          if (!dogs.length) return of([]);

          return forkJoin(
            dogs.map((dog) =>
              this.reservationApi.getDogReservations$(dog.dogId).pipe(
                map((reservations) => ({
                  ...dog,
                  reservations,
                })),
              ),
            ),
          );
        }),
      ),
  });
}
