import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserReview } from '../../models/userReview.model';
import { Dog } from '../../models/dog.model';
import { User } from '../../core/auth/models/user.model';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'anna_nowak',
    email: 'anna.nowak@example.com',
    firstName: 'Anna',
    lastName: 'Nowak',
    role: 'USER',
    dateOfBirth: new Date('1994-05-20'), // ok. 30 lat
  },
  {
    id: 2,
    username: 'piotr_lewy',
    email: 'piotr.lewandowicz@example.com',
    firstName: 'Piotr',
    lastName: 'Lewandowicz',
    role: 'USER',
    dateOfBirth: new Date('2000-11-15'), // ok. 24 lata
  },
  {
    id: 3,
    username: 'kasia_wojcik',
    email: 'katarzyna.wojcik@example.com',
    firstName: 'Katarzyna',
    lastName: 'Wójcik',
    role: 'ADMIN',
    dateOfBirth: new Date('1982-03-10'), // ok. 42 lata
  },
];

export const MOCK_DOGS: Dog[] = [
  {
    dogId: 101,
    ownerId: 1, // Anna Nowak (MOCK_USERS[0].id)
    name: 'Burek',
    breed: { breedCode: 'MIX', name: 'Mieszaniec' },
    notes: 'Przyjazny, energiczny pies.',
    size: 'MEDIUM',
    weightKg: 15,
    isActive: true,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-06-20T14:30:00Z',
    photos: [
      {
        photoId: 501,
        url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80',
        uploadedAt: '2025-12-31T11:29:27.685Z',
      },
    ],
  },
  {
    dogId: 102,
    ownerId: 1, // Anna Nowak
    name: 'Luna',
    breed: { breedCode: 'BEAGLE', name: 'Beagle' },
    notes: 'Uwielbia węszyć.',
    size: 'SMALL',
    weightKg: 11,
    isActive: true,
    createdAt: '2023-02-10T09:00:00Z',
    updatedAt: '2023-02-10T09:00:00Z',
    photos: [
      {
        photoId: 502,
        url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=300&q=80',
        uploadedAt: '2025-12-31T12:00:00Z',
      },
    ],
  },
  {
    dogId: 103,
    ownerId: 2, // Piotr Lewandowicz (MOCK_USERS[1].id)
    name: 'Azor',
    breed: { breedCode: 'HUSKY', name: 'Husky' },
    notes: 'Wymaga dużo ruchu.',
    size: 'LARGE',
    weightKg: 28,
    isActive: true,
    createdAt: '2023-05-05T16:20:00Z',
    updatedAt: '2023-08-12T11:15:00Z',
    photos: [
      {
        photoId: 503,
        url: 'https://images.unsplash.com/photo-1596796245643-6c7c251d7c92?auto=format&fit=crop&w=300&q=80',
        uploadedAt: '2025-12-31T13:00:00Z',
      },
    ],
  },
  {
    dogId: 104,
    ownerId: 3, // Katarzyna Wójcik (MOCK_USERS[2].id)
    name: 'Fafik',
    breed: { breedCode: 'TERRIER', name: 'Terier' },
    notes: 'Starszy piesek.',
    size: 'SMALL',
    weightKg: 8,
    isActive: true,
    createdAt: '2022-11-20T08:45:00Z',
    updatedAt: '2024-01-10T18:00:00Z',
    photos: [],
  },
];

@Component({
  selector: 'app-user-details',
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
    RouterLink,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent {
  private readonly snackBar = inject(MatSnackBar);
  public readonly user = computed(() => MOCK_USERS.find((u: User) => u.id === this.id()) ?? null);

  public readonly userPets = computed(() => {
    const currentUser = this.user();
    if (!currentUser) return [];
    return MOCK_DOGS.filter((dog) => dog.ownerId === currentUser.id);
  });

  public readonly reviews = signal<UserReview[]>([
    {
      id: '1',
      author: 'Marek (właściciel Reksia)',
      createdAt: new Date('2025-09-10'),
      text: 'Super podejście! Reksio wrócił zmęczony i szczęśliwy. Polecam każdemu.',
      rating: 4.5,
      reported: false,
    },
    {
      id: '2',
      author: 'Kasia',
      createdAt: new Date('2025-09-05'),
      text: 'Punktualna i bardzo miła osoba. Na pewno skorzystam ponownie.',
      rating: 5,
      reported: false,
    },
  ]);
  public readonly stars = [1, 2, 3, 4, 5];
  public readonly hoverRating = signal<number | null>(null);
  protected readonly score = computed(() =>
    (
      this.reviews().reduce((score, review) => score + review.rating, 0) / this.reviews().length
    ).toFixed(2),
  );
  public readonly id = input.required<number, string>({ transform: numberAttribute });

  public readonly reviewForm = new FormGroup({
    text: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    rating: new FormControl<number>(5, { nonNullable: true }), // <--- Add control
  });

  public get textControl(): FormControl<string> {
    return this.reviewForm.controls.text;
  }

  public getAvatarUrl(): string | null {
    const u = this.user();
    if (!u) {
      return null;
    }
    // Generuje awatar z inicjałami (np. Anna Nowak -> AN)
    // background=random: losowy kolor tła
    // color=fff: biały tekst
    return `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=random&color=fff&size=200`;
  }

  public getStarIcon(starIndex: number): string {
    const currentRating =
      this.hoverRating() ?? this.reviewForm.controls.text.parent?.get('rating')?.value ?? 0;

    if (currentRating >= starIndex) {
      return 'star'; // Full
    } else if (currentRating >= starIndex - 0.5) {
      return 'star_half'; // Half
    } else {
      return 'star_border'; // Empty
    }
  }
  public getRatingForReview(rating: number, index: number): string {
    if (rating >= index) {
      return 'star';
    } else if (rating >= index - 0.5) {
      return 'star_half';
    } else {
      return 'star_border';
    }
  }

  public onStarHover(event: MouseEvent, starIndex: number): void {
    const target = event.target as HTMLElement;
    const { width, left } = target.getBoundingClientRect();
    const x = event.clientX - left; // X position within the icon

    // If mouse is on the left 50% of the icon, subtract 0.5
    const isHalf = x < width / 2;
    const rating = isHalf ? starIndex - 0.5 : starIndex;

    this.hoverRating.set(rating);
  }

  public onStarLeave(): void {
    this.hoverRating.set(null);
  }

  public onStarClick(): void {
    if (this.hoverRating() !== null) {
      this.reviewForm.patchValue({ rating: this.hoverRating() || 5 });
    }
  }

  public onSubmitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const { text, rating } = this.reviewForm.getRawValue();
    if (!text) return;

    const newReview: UserReview = {
      id: Date.now().toString(),
      author: 'Ty',
      createdAt: new Date(),
      text,
      rating: rating ?? 5,
      reported: false,
    };

    this.reviews.update((current) => [newReview, ...current]);
    this.reviewForm.reset({ text: '', rating: 5 });
    this.snackBar.open('Twoja opinia została dodana.', 'OK', { duration: 4000 });
  }

  public onReportReview(reviewId: string): void {
    this.reviews.update((current) =>
      current.map((r) => (r.id === reviewId ? { ...r, reported: true } : r)),
    );
    this.snackBar.open('Zgłoszono opinię do moderacji.', 'OK', { duration: 4000 });
  }

  public getAge(dateOfBirth: Date | string): number {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }
}
