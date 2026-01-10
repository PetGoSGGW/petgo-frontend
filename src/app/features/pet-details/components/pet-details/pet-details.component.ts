import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';

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
import {
  EditDogDialogComponent,
  EditDogDialogResult,
} from './components/edit-dog-details-dialog/edit-dog-details-dialog.component';
import { filter, switchMap } from 'rxjs';
import { DogApiService } from '../../../../services/dog-api.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SectionWrapperComponent } from '../../../../components/section-wrapper/section-wrapper.component';

interface DogReview {
  id: string;
  authorName: string;
  createdAt: Date;
  text: string;
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
    MatProgressSpinner,
    SectionWrapperComponent,
  ],
})
export class PetDetailsComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly dogApi = inject(DogApiService);
  private readonly authService = inject(AuthService);

  protected readonly currentUserId = this.authService.userId;

  public readonly id = input.required<number, string>({
    transform: (id) => Number(id),
  });

  protected readonly dogResource = rxResource<Dog, { id: number }>({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.dogApi.getDog$(params.id),
  });

  public readonly reviews = signal<DogReview[]>([]);

  public readonly reviewForm = new FormGroup<{ text: FormControl<string> }>({
    text: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  public get textControl(): FormControl<string> {
    return this.reviewForm.controls.text;
  }

  public openEditDogDialog(dog: Dog): void {
    const dialogRef = this.dialog.open(EditDogDialogComponent, {
      width: '600px',
      data: {
        name: dog.name,
        breed: dog.breed,
        notes: dog.notes ?? '',
        size: dog.size ?? 'M',
        weightKg: Number(dog.weightKg ?? 0),
        isActive: dog.isActive,
      } satisfies EditDogDetailsDialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result): result is EditDogDialogResult => !!result),
        switchMap((result) =>
          this.dogApi.updateDog$(dog.dogId, { ...result, breedCode: dog.breed.breedCode }),
        ),
      )
      .subscribe({
        next: (updatedDog: Dog) => {
          this.dogResource.set(updatedDog);
          this.snackBar.open('Zapisano zmiany w profilu psa.', 'OK');
        },
        error: () => {
          this.snackBar.open('Nie udało się zapisać zmian.', 'OK');
        },
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
    );
  }
}
