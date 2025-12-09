import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';

interface UserProfile {
  id: string;
  name: string;
  isActive: boolean;
  location: string;
  age: number;
  experience: number;
  description: string;
  photos: string[];
}

interface UserReview {
  id: string;
  author: string;
  createdAt: Date;
  text: string;
  rating: number;
  reported: boolean;
}

export const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'Anna Nowak',
    isActive: false,
    location: 'Warszawa, Mokotów',
    age: 30,
    experience: 3,
    description:
      'Cześć! Jestem studentką weterynarii i uwielbiam spędzać czas aktywnie. Mam doświadczenie zarówno z małymi, jak i dużymi psami. Wiem, jak udzielić pierwszej pomocy. Chętnie zabiorę Twojego pupila na długi spacer do parku!',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: '2',
    name: 'Piotr Lewandowicz',
    isActive: true,
    location: 'Wrocław, Krzyki',
    age: 24,
    experience: 1,
    description:
      'Jestem studentem AWF i zapalonym biegaczem. Jeśli Twój pies potrzebuje wybiegania i dużej dawki ruchu, świetnie się dogadamy. Preferuję rasy aktywne, z którymi mogę trenować canicross.',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80', // Wspólne zdjęcie z psem
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: '3',
    name: 'Katarzyna Wójcik',
    isActive: true,
    location: 'Gdańsk, Przymorze',
    age: 42,
    experience: 12,
    description:
      'Jestem certyfikowaną behawiorystką z wieloletnim stażem. Specjalizuję się w pracy z psami lękowymi i reaktywnymi. Oferuję spacery socjalizacyjne oraz opiekę nad psami wymagającymi szczególnej troski.',
    photos: [
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80',
    ],
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
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  public readonly user = signal<UserProfile | null>(null);

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
  public readonly score = signal<number>(0);

  public readonly reviewForm = new FormGroup({
    text: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    rating: new FormControl<number>(5, { nonNullable: true }), // <--- Add control
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found: UserProfile | undefined = MOCK_USERS.find(
        (u: UserProfile): boolean => u.id === id,
      );
      this.user.set(found ?? null);
    }
    this.calculateScore();
  }

  public calculateScore(): void {
    const totalScore =
      this.reviews().reduce((score, review) => score + review.rating, 0) / this.reviews().length;
    this.score.set(Number(totalScore.toFixed(2)));
  }
  public get textControl(): FormControl<string> {
    return this.reviewForm.controls.text;
  }

  public getAvatarUrl(): string | null {
    const u = this.user();
    return u && u.photos.length > 0 ? u.photos[0] : null;
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
    const rect = target.getBoundingClientRect();
    const { width } = rect;
    const x = event.clientX - rect.left; // X position within the icon

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
    this.calculateScore();

    this.snackBar.open('Twoja opinia została dodana.', 'OK', { duration: 4000 });
  }

  public onReportReview(reviewId: string): void {
    this.reviews.update((current) =>
      current.map((r) => (r.id === reviewId ? { ...r, reported: true } : r)),
    );
    this.snackBar.open('Zgłoszono opinię do moderacji.', 'OK', { duration: 4000 });
  }
}
