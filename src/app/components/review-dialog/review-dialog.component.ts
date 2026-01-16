import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogTitle,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Reservation } from '../../models/reservation.model';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ReviewApiService } from '../../services/review-api.service';
import { ReviewType } from '../../models/review-type.model';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-review-dialog',
  styleUrl: './review-dialog.component.css',
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content class="review-content">
      <div class="rating-container">
        <p class="label">Ocena *</p>
        <div class="stars">
          @for (star of stars(); track star) {
            <button
              matIconButton
              (click)="onRatingChanged(star)"
              [color]="rating() >= star ? 'primary' : ''"
              matTooltip="Oceń na {{ star }}"
              type="button"
            >
              <mat-icon>{{ getStarIcon(star) }}</mat-icon>
            </button>
          }
        </div>
      </div>

      <mat-form-field class="full-width">
        <mat-label>Wiadomość *</mat-label>
        <textarea
          matInput
          [(ngModel)]="message"
          rows="4"
          placeholder="Napisz co myślisz..."
        ></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton="outlined" (click)="dialogRef.close()">Zamknij</button>
      <button
        matButton="tonal"
        [disabled]="message().length === 0 || rating() === 0"
        (click)="addReview()"
      >
        Dodaj opinię
      </button>
    </mat-dialog-actions>
  `,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInput,
    MatIcon,
    MatTooltipModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ReviewApiService],
})
export class ReviewDialogComponent {
  protected readonly data = inject<ReviewDialogData>(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef);
  private readonly reviewApi = inject(ReviewApiService);
  private readonly matSnackBar = inject(MatSnackBar);

  protected title = (
    {
      DOG: 'Napisz opinię o pupilu',
      WALK: 'Napisz opinię o spacerze',
      WALKER: 'Napisz opinię o osobie wyprowadzającej pupile',
    } satisfies Record<ReviewType, string>
  )[this.data.type];

  protected readonly message = signal('');
  protected readonly rating = signal(0);
  protected readonly stars = signal(
    Array(5)
      .fill(0)
      .map((_, i) => i + 1),
  ).asReadonly();

  protected readonly loading = signal(false);

  protected getStarIcon(starId: number): string {
    if (this.rating() >= starId) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  protected onRatingChanged(rating: number): void {
    this.rating.set(rating);
  }

  protected addReview(): void {
    this.loading.set(true);

    this.reviewApi
      .addReview({
        reservationId: this.data.reservationId,
        reviewType: this.data.type,
        rating: this.rating(),
        comment: this.message().trim(),
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.matSnackBar.open('Dodano opinię', 'OK');
        },
        error: () => {
          this.matSnackBar.open('Wystąpił błąd!', 'OK');
        },
      });
  }
}

export interface ReviewDialogData {
  type: ReviewType;
  reservationId: Reservation['reservationId'];
}
