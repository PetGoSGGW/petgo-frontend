import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Pipe,
  PipeTransform,
} from '@angular/core';
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
import { ChatUser } from '../../../../models/chat.model';

@Pipe({
  name: 'avatar',
})
export class AvatarPipe implements PipeTransform {
  public transform(user: ChatUser): string {
    if (!user) return `https://ui-avatars.com/api/?name=AA&background=random&color=fff&size=200`;
    return `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff&size=200`;
  }
}

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css',
  imports: [MatProgressSpinner, MatError, MatIcon, RouterLink, SectionWrapperComponent, AvatarPipe],
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
        const key = reservation.ownerId;

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
              .filter(
                ({ status, bookedSlots }) =>
                  (status === 'CONFIRMED' || status === 'COMPLETED') && bookedSlots.length > 0,
              )
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
              .filter(
                ({ status, bookedSlots }) =>
                  (status === 'CONFIRMED' || status === 'COMPLETED') && bookedSlots.length > 0,
              )
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
