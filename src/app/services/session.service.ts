import { inject, Injectable } from '@angular/core';
import { concatMap, map, Subject, switchMap, take, takeUntil, tap, timer } from 'rxjs';
import { SessionApiService } from './session-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly sessionApi = inject(SessionApiService);
  private readonly matSnackBar = inject(MatSnackBar);

  private stop$ = new Subject<void>();
  private activeSessionId: number | null = null;

  public startWalk$(reservationId: number) {
    this.stop$ = new Subject<void>();

    return this.sessionApi.startWalk$(reservationId).pipe(
      tap((sessionId) => {
        this.activeSessionId = sessionId;
      }),
      switchMap((sessionId) => this.simulateWalk$(sessionId)),
    );
  }

  public stopWalk(): void {
    if (!this.activeSessionId) {
      this.matSnackBar.open('Brak aktywnej sesji spaceru');
      return;
    }

    const sessionId = this.activeSessionId;
    this.stop$.next();
    this.activeSessionId = null;

    this.sessionApi.finishWalk$(sessionId).subscribe({
      next: () => {
        this.matSnackBar.open('Spacer został zakończony');
      },
      error: () => {
        this.matSnackBar.open('Wystąpił błąd. Nie zakończono spaceru');
      },
    });
  }

  private simulateWalk$(sessionId: number) {
    const totalSeconds = 35;
    const startLat = 52.2297;
    const startLng = 21.0122;
    const deltaLat = 1 / 111;

    return timer(0, 1000).pipe(
      take(totalSeconds),
      map((index) => {
        const progress = (index + 1) / totalSeconds;
        return {
          latitude: startLat + deltaLat * progress,
          longitude: startLng,
        };
      }),
      concatMap((point) =>
        this.sessionApi
          .addCoordinatePoint$({
            sessionId,
            latitude: point.latitude,
            longitude: point.longitude,
          })
          .pipe(map(() => point)),
      ),
      takeUntil(this.stop$),
    );
  }
}
