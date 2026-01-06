import { Component, inject, input, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UserApiService } from '../../services/user-api.service';
import { DogApiService } from '../../services/dog-api.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    RouterLink,
    MatProgressSpinner,
    MatError,
  ],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'], // <- poprawiona nazwa
})
export class UserDetailsComponent {
  private readonly userApiService = inject(UserApiService);
  private readonly dogApiService = inject(DogApiService);

  public readonly id = input.required<number, string>({ transform: numberAttribute });

  protected readonly user = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params: { id } }) => this.userApiService.getUser(id),
  });

  protected readonly dogs = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params: { id } }) => this.dogApiService.getDogsByUserId(id),
  });

  // <- WAŻNE: reviews musi być protected/public
  protected readonly reviews = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params: { id } }) => this.userApiService.getUserReviews(id),
  });

  // średnia ocena: odczytujemy z reviews.value().avgRating
  protected get avgRating(): number {
    return this.reviews.hasValue() ? this.reviews.value().avgRating : 0;
  }

  protected getAvatarUrl(): string | null {
    const u = this.user.hasValue() ? this.user.value() : null;

    if (!u) return `https://ui-avatars.com/api/?name=AA&background=random&color=fff&size=200`;
    return `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=random&color=fff&size=200`;
  }

  protected getRatingForReview(rating: number, index: number): string {
    if (rating >= index) {
      return 'star';
    } else if (rating >= index - 0.5) {
      return 'star_half';
    } else {
      return 'star_border';
    }
  }

  protected getAge(birth: Date | string | null): number {
    if (!birth) return 0;

    const dob = new Date(birth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }
}
