import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
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
import { sampleDogs } from '../../../../data/sample-data';

interface DogReview {
  id: string;
  authorName: string;
  createdAt: Date;
  text: string;
  reported: boolean;
}

const CURRENT_USER_ID = 1;

const DOG_PHOTOS: Record<number, string[]> = {
  1: [
    'https://placedog.net/600/400?id=1',
    'https://placedog.net/400/300?id=11',
    'https://placedog.net/400/300?id=12',
  ],
  2: ['https://placedog.net/600/400?id=2', 'https://placedog.net/400/300?id=21'],
};

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

  public readonly dog = signal<Dog | null>(null);

  public readonly id = input.required<number, string>({
    transform: (id) => Number(id),
  });

  public readonly reviews = signal<DogReview[]>([
    {
      id: '1',
      authorName: 'Jan Kowalski',
      createdAt: new Date(),
      text: 'Świetny, bardzo przyjazny pies!',
      reported: false,
    },
  ]);

  public readonly reviewForm = new FormGroup<{ text: FormControl<string> }>({
    text: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  constructor() {
    effect(() => {
      const id = this.id();

      const found = sampleDogs.find((d) => d.dogId === id);
      this.dog.set(found ?? null);
    });
  }

  public get textControl(): FormControl<string> {
    return this.reviewForm.controls.text;
  }

  public isOwner(dog: Dog): boolean {
    return dog.ownerId === CURRENT_USER_ID;
  }

  public getPhotos(dogId: number): string[] {
    return DOG_PHOTOS[dogId] ?? [];
  }

  public getFirstPhotoUrl(): string | null {
    const currentDog = this.dog();
    if (!currentDog) return null;

    const photos = this.getPhotos(currentDog.dogId);
    return photos.length > 0 ? photos[0] : null;
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

    const text = this.reviewForm.controls.text.value.trim();
    if (!text) return;

    const newReview: DogReview = {
      id: Date.now().toString(),
      authorName: 'Ty',
      createdAt: new Date(),
      text,
      reported: false,
    };

    this.reviews.update((current) => [...current, newReview]);
    this.reviewForm.reset();

    this.snackBar.open('Twoja opinia została dodana i jest widoczna publicznie.', 'OK', {
      duration: 4000,
    });
  }

  public onReportReview(reviewId: string, reported: boolean): void {
    this.reviews.update((current) =>
      current.map((review) => (review.id === reviewId ? { ...review, reported } : review)),
    );

    this.snackBar.open(
      reported
        ? 'Opinia została zgłoszona do weryfikacji przez administratora.'
        : 'Zgłoszenie opinii zostało cofnięte.',
      'OK',
      { duration: 4000 },
    );
  }
}
