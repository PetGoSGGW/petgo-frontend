import { inject, Injectable } from '@angular/core';
import { concatMap, map, Subject, switchMap, take, takeUntil, tap, timer, EMPTY } from 'rxjs';
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
      switchMap((sessionId) => this.simulateGraffiti$(sessionId)),
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

  private simulateGraffiti$(sessionId: number) {
    const points = this.createGraffitiPath();
    const intervalMs = Math.max(100, Math.floor(10000 / Math.max(points.length, 1)));

    if (!points.length) {
      return EMPTY;
    }

    return timer(0, intervalMs).pipe(
      take(points.length),
      concatMap((index) => {
        const point = points[index];
        return this.sessionApi
          .addCoordinatePoint$({
            sessionId,
            latitude: point.latitude,
            longitude: point.longitude,
          })
          .pipe(map(() => point));
      }),
      takeUntil(this.stop$),
    );
  }

  private createGraffitiPath() {
    const baseLat = 52.2297;
    const baseLng = 21.0122;
    const scaleLat = 0.0002;
    const scaleLng = 0.00025;
    const letterSpacing = 0.6;
    const text = 'ZAL';
    const letterPatterns: Record<string, [number, number][]> = {
      Z: [
        [0.05, 1.2],
        [0.55, 1.2],
        [0.12, 0.15],
        [0.55, 0.05],
      ],
      A: [
        [0, 0],
        [0.25, 1.2],
        [0.5, 0],
        [0.35, 0.6],
        [0.15, 0.6],
      ],
      L: [
        [0, 1.2],
        [0, 0],
        [0.45, 0],
      ],
    };

    let cursorX = -0.8;
    const data: { latitude: number; longitude: number }[] = [];

    for (const char of text) {
      if (char === ' ') {
        cursorX += letterSpacing;
        continue;
      }

      const pattern = letterPatterns[char];
      if (!pattern) {
        cursorX += letterSpacing;
        continue;
      }

      for (const [relX, relY] of pattern) {
        data.push({
          latitude: baseLat + relY * scaleLat,
          longitude: baseLng + (cursorX + relX) * scaleLng,
        });
      }

      cursorX += letterSpacing;
      // add small connector to next letter
      const lastPoint = pattern[pattern.length - 1];
      data.push({
        latitude: baseLat + lastPoint[1] * scaleLat,
        longitude: baseLng + (cursorX + lastPoint[0]) * scaleLng,
      });
    }

    return data;
  }
}
