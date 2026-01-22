import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { SectionWrapperComponent } from '../../components/section-wrapper/section-wrapper.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { ReservationStatus } from '../../models/reservation.model';
import { DogApiService } from '../../services/dog-api.service';
import { ReservationApiService } from '../../services/reservation-api.service';

type PlannedItem = {
  reservationId: number;
  date: DateTime;
  dateLabel: string;
  time: string;
  dogName: string;
  role: 'owner' | 'walker';
  status: ReservationStatus;
};

@Component({
  selector: 'app-walkers-plan',
  templateUrl: './walkers-plan.component.html',
  styleUrl: './walkers-plan.component.css',
  imports: [
    SectionWrapperComponent,
    MatProgressSpinner,
    MatButton,
    MatError,
    MatIcon,
    MatTabsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WalkersPlanComponent {
  private readonly dogApi = inject(DogApiService);
  private readonly reservationApi = inject(ReservationApiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly visibleStatuses = new Set<ReservationStatus>(['CONFIRMED', 'COMPLETED']);

  protected readonly visibleMonth = signal(DateTime.local().startOf('month'));
  protected readonly weekDays = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'];

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
                  reservations: reservations.filter(({ status }) =>
                    this.visibleStatuses.has(status),
                  ),
                })),
              ),
            ),
          );
        }),
      ),
  });

  protected readonly walkerReservations = rxResource({
    stream: () =>
      this.reservationApi.getWalkerReservations$().pipe(
        map((reservations) =>
          reservations.filter(({ status }) => this.visibleStatuses.has(status)),
        ),
      ),
  });

  protected readonly walkerDogs = rxResource({
    params: () => {
      if (!this.walkerReservations.hasValue()) return undefined;

      const ids = [
        ...new Set(this.walkerReservations.value().map((reservation) => reservation.dogId)),
      ];

      return { ids };
    },
    stream: ({ params: { ids } }) => {
      if (!ids.length) {
        return of(new Map<number, string>());
      }

      return forkJoin(ids.map((id) => this.dogApi.getDog$(id))).pipe(
        map((dogs) => new Map(dogs.map((dog) => [dog.dogId, dog.name]))),
      );
    },
  });

  protected readonly plannedItems = computed<PlannedItem[]>(() => {
    const dogs = this.dogsWithReservations.value() ?? [];
    const currentUserId = this.userId();
    const walkerReservations = this.walkerReservations.value() ?? [];
    const walkerDogNames = this.walkerDogs.value() ?? new Map<number, string>();

    const ownerItems = dogs.flatMap((dog) =>
      dog.reservations.map((reservation) => {
        const start = DateTime.fromISO(reservation.scheduleStart);
        const role: PlannedItem['role'] =
          reservation.walkerId === currentUserId ? 'walker' : 'owner';

        return {
          reservationId: reservation.reservationId,
          date: start,
          dateLabel: start.setLocale('pl').toFormat('dd.LL'),
          time: start.toFormat('HH:mm'),
          dogName: dog.name,
          role,
          status: reservation.status,
        };
      }),
    );

    const walkerItems = walkerReservations.map((reservation) => {
      const start = DateTime.fromISO(reservation.scheduleStart);
      const dogName = walkerDogNames.get(reservation.dogId) ?? `Pies #${reservation.dogId}`;

      return {
        reservationId: reservation.reservationId,
        date: start,
        dateLabel: start.setLocale('pl').toFormat('dd.LL'),
        time: start.toFormat('HH:mm'),
        dogName,
        role: 'walker' as const,
        status: reservation.status,
      };
    });

    const seen = new Set<number>();
    return [...ownerItems, ...walkerItems].filter((item) => {
      if (seen.has(item.reservationId)) return false;
      seen.add(item.reservationId);
      return true;
    });
  });

  protected readonly plannedOwner = computed(() => {
    const now = DateTime.local();
    return this.plannedItems()
      .filter((item) => item.role === 'owner' && item.date >= now)
      .sort((a, b) => a.date.toMillis() - b.date.toMillis());
  });

  protected readonly plannedWalker = computed(() => {
    const now = DateTime.local();
    return this.plannedItems()
      .filter((item) => item.role === 'walker' && item.date >= now)
      .sort((a, b) => a.date.toMillis() - b.date.toMillis());
  });

  protected readonly monthLabel = computed(() =>
    this.visibleMonth().setLocale('pl').toFormat('LLLL yyyy'),
  );

  protected readonly plannedByDateKey = computed(() => {
    const map = new Map<string, PlannedItem>();

    for (const item of this.plannedItems()) {
      const key = this.dateKey(item.date);
      if (!map.has(key)) {
        map.set(key, item);
      }
    }

    return map;
  });

  protected readonly calendarCells = computed(() => {
    const month = this.visibleMonth();
    const firstDay = month.startOf('month');
    const firstWeekday = firstDay.weekday % 7;
    const daysInMonth = month.daysInMonth ?? 30;
    const totalCells = firstWeekday + daysInMonth;
    const rows = Math.ceil(totalCells / 7);
    const ownerKeys = new Set(this.plannedOwner().map((item) => this.dateKey(item.date)));
    const walkerKeys = new Set(this.plannedWalker().map((item) => this.dateKey(item.date)));
    const completedKeys = new Set(
      this.plannedItems()
        .filter((item) => item.status === 'COMPLETED')
        .map((item) => this.dateKey(item.date)),
    );
    const plannedByDateKey = this.plannedByDateKey();

    const cells: Array<{
      day?: number;
      isOwner: boolean;
      isWalker: boolean;
      isCompleted: boolean;
      reservationId?: number;
      ariaLabel?: string;
    }> = [];

    for (let i = 0; i < rows * 7; i += 1) {
      if (i < firstWeekday) {
        cells.push({ isOwner: false, isWalker: false, isCompleted: false });
        continue;
      }

      const day = i - firstWeekday + 1;
      if (day > daysInMonth) {
        cells.push({ isOwner: false, isWalker: false, isCompleted: false });
        continue;
      }

      const date = month.set({ day });
      const key = this.dateKey(date);
      const isOwner = ownerKeys.has(key);
      const isWalker = walkerKeys.has(key);
      const isCompleted = completedKeys.has(key);
      const planned = plannedByDateKey.get(key);

      cells.push({
        day,
        isOwner,
        isWalker,
        isCompleted,
        reservationId: planned?.reservationId,
        ariaLabel: date.setLocale('pl').toFormat('dd LLLL yyyy'),
      });
    }

    return cells;
  });

  protected shiftMonth(offset: number): void {
    const current = this.visibleMonth();
    this.visibleMonth.set(current.plus({ months: offset }).startOf('month'));
  }

  protected openReservation(reservationId?: number): void {
    if (!reservationId) return;
    void this.router.navigate(['/spacer', reservationId]);
  }

  protected statusLabel(status: ReservationStatus): string {
    switch (status) {
      case 'PENDING':
        return 'Do akceptacji';
      case 'COMPLETED':
        return 'Zakończony';
      case 'CONFIRMED':
        return 'Zaplanowany';
      case 'CANCELLED':
        return 'Anulowany';
      default:
        return status;
    }
  }

  private dateKey(date: DateTime): string {
    return date.toISODate() ?? '';
  }
}
