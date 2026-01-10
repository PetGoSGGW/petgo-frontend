import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Dog } from '../../../../models/dog.model';
import { EditDogDetailsDialogData } from './models/edit-dog-details-dialog-data.model';
import { EditDogDialogComponent } from './components/edit-dog-details-dialog/edit-dog-details-dialog.component';
import { filter } from 'rxjs';

import { ReviewApiService } from '../../../../services/review-api.service';
import { CreateReviewRequest, DogReview, Review } from '../../../../models/review.model';

const CURRENT_USER_ID = 1;

interface DogReviewItem {
  id: string;
  authorName: string;
  createdAt: Date;
  text: string;
  rating: number;
  reported: boolean;
}

@Component({
  selector: 'app-pet-details',
  standalone: true,
  templateUrl: './pet-details.component.html',
  styleUrls: ['./pet-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
})
export class PetDetailsComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly reviewApi = inject(ReviewApiService);

  public readonly dog = signal<Dog | null>(null);

  public readonly id = input.required<number, string>({
    transform: (id) => Number(id),
  });

  public readonly reviews = signal<DogReviewItem[]>([]);

  public readonly reviewForm = new FormGroup<{
    text: FormControl<string>;
    rating: FormControl<number>;
  }>({
    text: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    rating: new FormControl<number>(5, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(5)],
    }),
  });

  public get textControl(): FormControl<string> {
    return this.reviewForm.controls.text;
  }

  public get ratingControl(): FormControl<number> {
    return this.reviewForm.controls.rating;
  }

  constructor() {
    this.loadDogReviews();
  }

  private loadDogReviews(): void {
    this.reviewApi.getDogReview(this.id()).subscribe({
      next: (dto: DogReview) => {
        this.reviews.set(this.mapReviews(dto.reviewDTOList));
      },
      error: () => {
        this.snackBar.open('Nie udało się pobrać opinii o psie.', 'OK', { duration: 4000 });
      },
    });
  }

  private mapReviews(list: Review[]): DogReviewItem[] {
    return (list ?? []).map((r) => ({
      id: `${r.createdAt}-${r.authorDto?.userId ?? 'unknown'}-${r.rating ?? '0'}`,
      authorName:
        `${r.authorDto?.firstName ?? ''} ${r.authorDto?.lastName ?? ''}`.trim() || 'Nieznany',
      createdAt: new Date(r.createdAt),
      text: r.comment ?? '',
      rating: r.rating ?? 0,
      reported: false,
    }));
  }

  public isOwner(dog: Dog): boolean {
    return dog.ownerId === CURRENT_USER_ID;
  }

  public getPhotos(_dogId: number): string[] {
    return this.dog()?.photos?.map((e) => e.url) ?? [];
  }

  public getFirstPhotoUrl(): string | null {
    return this.dog()?.photos?.[0]?.url ?? null;
  }

  public openEditDogDialog(currentDog: Dog): void {
    if (!this.isOwner(currentDog)) return;

    const dialogRef = this.dialog.open(EditDogDialogComponent, {
      width: '520px',
      data: {
        name: currentDog.name,
        breed: currentDog.breed,
        notes: currentDog.notes ?? '',
        size: currentDog.size ?? 'M',
        weightKg: Number(currentDog.weightKg ?? 0),
        isActive: currentDog.isActive,
      } satisfies EditDogDetailsDialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result) => !!result))
      .subscribe((result: EditDogDetailsDialogData) => {
        this.dog.update((dog) => {
          if (!dog) return dog;

          return {
            ...dog,
            name: result.name,
            breed: result.breed,
            notes: result.notes,
            size: result.size,
            weightKg: Number(result.weightKg),
            isActive: result.isActive,
            updatedAt: new Date().toISOString(),
          };
        });

        this.snackBar.open('Zapisano zmiany w profilu psa.', 'OK', { duration: 4000 });
      });
  }

  public onSubmitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const text = this.textControl.value.trim();
    const rating = this.ratingControl.value;

    if (!text) return;

    const payload: CreateReviewRequest = {
      reservationId: 0, 
      reviewType: 'DOG',
      rating, 
      comment: text, 
    };

    this.reviewApi.createReview(payload).subscribe({
      next: () => {
        this.reviewForm.reset({ text: '', rating: 5 });
        this.snackBar.open('Twoja opinia została dodana.', 'OK', { duration: 4000 });
        this.loadDogReviews();
      },
      error: () => {
        this.snackBar.open(
          'Nie udało się dodać opinii (backend mógł odrzucić reservationId=0).',
          'OK',
          { duration: 5000 },
        );
      },
    });
  }

  public onReportReview(reviewId: string, reported: boolean): void {
    this.reviews.update((current) =>
      current.map((review) => (review.id === reviewId ? { ...review, reported } : review)),
    );

    this.snackBar.open(
      reported
        ? 'Opinia została oznaczona jako zgłoszona (lokalnie).'
        : 'Zgłoszenie opinii zostało cofnięte (lokalnie).',
      'OK',
      { duration: 4000 },
    );
  }
}
