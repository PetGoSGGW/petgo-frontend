import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { ReservationCardComponent } from './components/reservation-card/reservation-card.component';
import { MatIcon } from '@angular/material/icon';
import { SectionWrapperComponent } from '../../components/section-wrapper/section-wrapper.component';
import { ReservationApiService } from '../../services/reservation-api.service';
import { DogApiService } from '../../services/dog-api.service';

@Component({
  selector: 'app-walker-reservations',
  imports: [
    MatProgressSpinner,
    MatError,
    ReservationCardComponent,
    MatIcon,
    SectionWrapperComponent,
  ],
  templateUrl: './walker-reservations.component.html',
  styleUrl: './walker-reservations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WalkerReservationsComponent {
  private readonly reservationApi = inject(ReservationApiService);
  protected readonly dogApi = inject(DogApiService);

  protected readonly reservations = rxResource({
    stream: () => this.reservationApi.getReservations$(),
  });
}
