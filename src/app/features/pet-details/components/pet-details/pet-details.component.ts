import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Dog } from '../../../../models/dog.model';
import { User } from '../../../../core/auth/models/user.model';

interface DogReview {
  id: string;
  authorName: string;
  createdAt: Date;
  text: string;
  reported: boolean;
}

type DogEditPayload = Pick<Dog, 'name' | 'breed' | 'notes' | 'size' | 'weightKg' | 'isActive'>;

const CURRENT_USER_ID = 1;

const MOCK_OWNER_1 = { userId: 1 } as unknown as User;
const MOCK_OWNER_999 = { userId: 999 } as unknown as User;

const MOCK_DOGS: Dog[] = [
  {
    dogId: 1,
    owner: MOCK_OWNER_1,
    breed: 'Mieszaniec',
    name: 'Burek',
    notes: 'Przyjazny, energiczny pies, lubi spacery i zabawy.',
    size: 'M',
    weightKg: 18,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    dogId: 2,
    owner: MOCK_OWNER_999,
    breed: 'Labrador',
    name: 'Luna',
    notes: 'Nieco nieśmiała, ale bardzo przytulasta.',
    size: 'L',
    weightKg: 28,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  public readonly dog = signal<Dog | null>(null);

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
    const idParam = this.route.snapshot.paramMap.get('id');
    const dogId = idParam ? Number(idParam) : Number.NaN;

    if (!Number.isNaN(dogId)) {
      const found = MOCK_DOGS.find((d) => d.dogId === dogId);
      this.dog.set(found ?? null);
    } else {
      this.dog.set(null);
    }
  }

  public get textControl(): FormControl<string> {
    return this.reviewForm.controls.text;
  }

  public isOwner(dog: Dog): boolean {
    return dog.owner.userId === CURRENT_USER_ID;
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
      } satisfies DogEditPayload,
    });

    dialogRef.afterClosed().subscribe((result: DogEditPayload | undefined) => {
      if (!result) return;

      this.dog.update((d) => {
        if (!d) return d;

        return {
          ...d,
          name: result.name,
          breed: result.breed,
          notes: result.notes,
          size: result.size,
          weightKg: Number(result.weightKg),
          isActive: result.isActive,
          updatedAt: new Date().toISOString(),
        };
      });

      this.snackBar.open('Zapisano zmiany w profilu psa.', 'OK', { duration: 3500 });
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

@Component({
  selector: 'app-edit-dog-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  template: `
    <div class="modal-container">
      <h2 mat-dialog-title>Edytuj szczegóły psa</h2>

      <div mat-dialog-content>
        <form [formGroup]="form" class="dialog-form">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Imię</mat-label>
            <input matInput formControlName="name" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Rasa</mat-label>
            <input matInput formControlName="breed" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Notatki</mat-label>
            <textarea matInput rows="3" formControlName="notes"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Rozmiar</mat-label>
            <mat-select formControlName="size">
              <mat-option value="S">S</mat-option>
              <mat-option value="M">M</mat-option>
              <mat-option value="L">L</mat-option>
              <mat-option value="XL">XL</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Waga (kg)</mat-label>
            <input matInput type="number" formControlName="weightKg" />
          </mat-form-field>

          <mat-slide-toggle formControlName="isActive">Aktywny</mat-slide-toggle>
        </form>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="close()">Anuluj</button>
        <button
          mat-raised-button
          color="primary"
          type="button"
          (click)="save()"
          [disabled]="form.invalid"
        >
          Zapisz
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-form {
        display: grid;
        gap: 12px;
        padding-top: 8px;
      }
      .full {
        width: 100%;
      }
      .modal-container {
        padding: 20px;
        overflow-y: auto;
        max-height: 700px;
      }
    `,
  ],
})
export class EditDogDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<EditDogDialogComponent>);
  private readonly data = inject<DogEditPayload>(MAT_DIALOG_DATA);

  public readonly form = new FormGroup<{
    name: FormControl<string>;
    breed: FormControl<string>;
    notes: FormControl<string>;
    size: FormControl<string>;
    weightKg: FormControl<number>;
    isActive: FormControl<boolean>;
  }>({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    breed: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl<string>('', { nonNullable: true }),
    size: new FormControl<string>('M', { nonNullable: true }),
    weightKg: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    isActive: new FormControl<boolean>(true, { nonNullable: true }),
  });

  constructor() {
    this.form.setValue({
      name: this.data.name,
      breed: this.data.breed,
      notes: this.data.notes ?? '',
      size: this.data.size ?? 'M',
      weightKg: Number(this.data.weightKg ?? 0),
      isActive: this.data.isActive,
    });
  }

  public close(): void {
    this.dialogRef.close();
  }

  public save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue());
  }
}
