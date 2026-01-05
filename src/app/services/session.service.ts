import { inject, Injectable } from '@angular/core';
import { LocationService } from './location.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { SessionApiService } from './session-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly localizationService = inject(LocationService);
  private readonly sessionApi = inject(SessionApiService);
  private readonly matSnackBar = inject(MatSnackBar);

  private stop$ = new Subject<void>();

  public startWalk(sessionId: number): void {
    this.localizationService
      .getCurrentLocation$()
      .pipe(
        switchMap(({ latitude, longitude }) =>
          this.sessionApi.addCoordinatePoint$({ sessionId, latitude, longitude }),
        ),
        takeUntil(this.stop$),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  public stopWalk(sessionId: number): void {
    this.sessionApi.finishWalk$(sessionId).subscribe({
      next: () => {
        this.matSnackBar.open('Spacer został zakończony');
        this.stop$.next();
      },
      error: () => {
        this.matSnackBar.open('Wystąpił błąd. Nie zakończono spaceru');
      },
    });
  }
}
