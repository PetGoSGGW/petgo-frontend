import { Component, computed, inject, input, numberAttribute } from '@angular/core';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserApiService } from '../../services/user-api.service';
import { DogApiService } from '../../services/dog-api.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

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
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent {
  private readonly userApiService = inject(UserApiService);
  private readonly dogApiService = inject(DogApiService);
  public readonly id = input.required<number, string>({ transform: numberAttribute });
  public readonly user = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.userApiService.getUser(id))),
  );
  public readonly userPets = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.dogApiService.getDogsByUserId(id))),
    { initialValue: [] },
  );
  public readonly reviews = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.userApiService.getUserReviews(id))),
  );
  public readonly score = computed(() => {
    const reviewsList = this.reviews();

    if (!reviewsList || reviewsList.length === 0) {
      return 0;
    }

    const sum = reviewsList.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviewsList.length) * 10) / 10;
  });

  public getAvatarUrl(): string | null {
    const u = this.user();
    if (!u) return `https://ui-avatars.com/api/?name=AA&background=random&color=fff&size=200`;
    // Generuje awatar z inicjałami (np. Anna Nowak -> AN)
    // background=random: losowy kolor tła
    // color=fff: biały tekst
    return `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=random&color=fff&size=200`;
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
