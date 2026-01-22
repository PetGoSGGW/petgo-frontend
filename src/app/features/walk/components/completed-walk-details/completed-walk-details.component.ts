import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { SectionWrapperComponent } from '../../../../components/section-wrapper/section-wrapper.component';
import { LuxonPipe } from '../../../../pipes/luxon.pipe';
import { ViewWalkComponent } from '../view-walk/view-walk.component';

interface CompletedWalkDetails {
  dogName: string;
  dogAvatarUrl: string | null;
  walkStatus: 'Zakonczony' | 'Anulowany';
  startAt: string;
  endAt: string;
  durationMinutes: number;
  distanceKm: number;
  events: string[];
  walkerNotes: string;
}

@Component({
  selector: 'app-completed-walk-details',
  templateUrl: './completed-walk-details.component.html',
  styleUrl: './completed-walk-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatTabsModule,
    ViewWalkComponent,
    SectionWrapperComponent,
    LuxonPipe,
  ],
})
export class CompletedWalkDetailsComponent {
  private readonly snackBar = inject(MatSnackBar);

  public readonly reservationId = input.required<number, string>({
    transform: (id) => Number(id),
  });

  protected readonly walkDetails = signal<CompletedWalkDetails>({
    dogName: 'Luna',
    dogAvatarUrl: null,
    walkStatus: 'Zakonczony',
    startAt: '2026-01-08T15:10:00',
    endAt: '2026-01-08T16:15:00',
    durationMinutes: 65,
    distanceKm: 4.2,
    events: ['Pauza na wode', 'Spotkanie z innym psem', 'Zabawa w parku'],
    walkerNotes: 'Spacer spokojny, pies chetnie szedl przy nodze. Warto zabrac wiecej wody.',
  });

  protected readonly rating = signal<number>(0);
  protected readonly stars = [1, 2, 3, 4, 5];

  protected readonly commentControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5), Validators.maxLength(250)],
  });

  protected readonly isSubmitDisabled = computed(
    () => this.rating() === 0 || this.commentControl.invalid,
  );

  protected setRating(value: number): void {
    this.rating.set(value);
  }

  protected submitReview(): void {
    if (this.isSubmitDisabled()) {
      this.commentControl.markAsTouched();
      return;
    }

    this.snackBar.open('Dziekujemy za ocene spaceru.', 'OK', { duration: 3000 });
    this.rating.set(0);
    this.commentControl.reset('');
  }

  protected formatDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const hourPart = hours > 0 ? `${hours} h` : null;
    const minutePart = `${minutes} min`;

    return [hourPart, minutePart].filter(Boolean).join(' ');
  }

  protected formatDistance(distanceKm: number): string {
    return `${distanceKm.toFixed(1)} km`;
  }
}
