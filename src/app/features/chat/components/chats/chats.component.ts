import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReservationApiService } from '../../../../services/reservation-api.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, map, switchMap } from 'rxjs';
import { ChatApiService } from '../../../../services/chat-api.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SectionWrapperComponent } from '../../../../components/section-wrapper/section-wrapper.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css',
  imports: [MatProgressSpinner, MatError, MatIcon, RouterLink, SectionWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatsComponent {
  private readonly reservationApi = inject(ReservationApiService);
  private readonly chatApi = inject(ChatApiService);
  private readonly authService = inject(AuthService);

  protected readonly userId = this.authService.userId;

  protected readonly chats = computed(() => {
    const reservations = this.reservations.hasValue() ? this.reservations.value() : [];

    const seen = new Set<number>();

    return reservations
      .filter((reservation) => {
        const key = reservation.walkerId;

        if (seen.has(key)) return false;

        seen.add(key);

        return true;
      })
      .flatMap((reservation) => reservation.chat);
  });

  protected readonly walkerChats = computed(() => {
    const walkerReservations = this.walkerReservations.hasValue()
      ? this.walkerReservations.value()
      : [];

    const seen = new Set<number>();

    return walkerReservations
      .filter((reservation) => {
        const key = reservation.walkerId;

        if (seen.has(key)) return false;

        seen.add(key);

        return true;
      })
      .flatMap((reservation) => reservation.chat);
  });

  protected readonly reservations = rxResource({
    stream: () =>
      this.reservationApi.getReservations$().pipe(
        switchMap((reservations) => {
          if (reservations.length === 0) return [];

          return forkJoin(
            reservations
              .filter(({ status }) => status === 'CONFIRMED' || status === 'COMPLETED')
              .map((reservation) =>
                this.chatApi.getChatByReservationId(reservation.reservationId).pipe(
                  map((chat) => ({
                    ...reservation,
                    chat,
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
        switchMap((reservations) => {
          if (reservations.length === 0) return [];

          return forkJoin(
            reservations
              .filter(({ status }) => status === 'CONFIRMED' || status === 'COMPLETED')
              .map((reservation) =>
                this.chatApi.getChatByReservationId(reservation.reservationId).pipe(
                  map((chat) => ({
                    ...reservation,
                    chat,
                  })),
                ),
              ),
          );
        }),
      ),
  });
}
