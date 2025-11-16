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

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  description: string;
  photos: string[];
}

interface PetReview {
  id: string;
  authorName: string;
  createdAt: Date;
  text: string;
  reported: boolean;
}

const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Burek',
    breed: 'Mieszaniec',
    age: '3 lata',
    description: 'Przyjazny, energiczny pies, lubi spacery i zabawy.',
    photos: [
      'https://placedog.net/600/400?id=1',
      'https://placedog.net/400/300?id=11',
      'https://placedog.net/400/300?id=12',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCfsoJXbTmd0zizizddDFlMH8n_-TRo844Ax4esDN-W2M-j93ILeX1MVDPsItyhrO4v80&usqp=CAU',
    ],
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Kot europejski',
    age: '2 lata',
    description: 'Nieco nieśmiała, ale bardzo przytulasta.',
    photos: ['https://placekitten.com/600/400', 'https://placekitten.com/400/300'],
  },
  {
    id: '3',
    name: 'Rex',
    breed: 'Owczarek niemiecki',
    age: '5 lat',
    description: 'Spokojny, lojalny i świetny stróż.',
    photos: ['https://placedog.net/600/400?id=2', 'https://placedog.net/400/300?id=21'],
  },
];

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
  ],
})
export class PetDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  public readonly pet = signal<Pet | null>(null);

  public readonly reviews = signal<PetReview[]>([
    {
      id: '1',
      authorName: 'Jan Kowalski',
      createdAt: new Date(),
      text: 'Świetny, bardzo przyjazny pies!',
      reported: false,
    },
  ]);

  public readonly reviewForm: FormGroup<{ text: FormControl<string> }> = new FormGroup<{
    text: FormControl<string>;
  }>({
    text: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const found: Pet | undefined = MOCK_PETS.find((p: Pet): boolean => p.id === id);
      this.pet.set(found ?? null);
    }
  }

  public get textControl(): FormControl<string> {
    return this.reviewForm.controls.text;
  }

  public onSubmitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const { value } = this.reviewForm;
    const text = value.text?.trim();
    if (!text) {
      return;
    }

    const newReview: PetReview = {
      id: Date.now().toString(),
      authorName: 'Ty',
      createdAt: new Date(),
      text,
      reported: false,
    };

    this.reviews.update((current: PetReview[]): PetReview[] => [...current, newReview]);
    this.reviewForm.reset();

    this.snackBar.open('Twoja opinia została dodana i jest widoczna publicznie.', 'OK', {
      duration: 4000,
    });
  }

  public onReportReview(reviewId: string): void {
    this.reviews.update((current: PetReview[]): PetReview[] =>
      current.map(
        (review: PetReview): PetReview =>
          review.id === reviewId ? { ...review, reported: true } : review,
      ),
    );

    this.snackBar.open('Opinia została zgłoszona do weryfikacji przez administratora.', 'OK', {
      duration: 4000,
    });
  }

  public getFirstPhotoUrl(): string | null {
    const currentPet = this.pet();
    if (!currentPet || !currentPet.photos || currentPet.photos.length === 0) {
      return null;
    }
    return currentPet.photos[0];
  }
}
