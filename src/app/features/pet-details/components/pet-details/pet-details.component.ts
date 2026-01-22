import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
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
import { EditDogDialogComponent } from './components/edit-dog-details-dialog/edit-dog-details-dialog.component';
import { filter } from 'rxjs';
import { DogApiService } from '../../../../services/dog-api.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SectionWrapperComponent } from '../../../../components/section-wrapper/section-wrapper.component';
import { environment } from '../../../../../environments/environment';

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
  protected readonly apiUrl = environment.apiUrl;

  protected readonly currentUserId = this.authService.userId;

  private readonly MAX_SIZE_MB = 2;
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  protected readonly uploadError = signal<string | null>(null);
  protected readonly currentFile = signal<File | null>(null);
  protected readonly previewUrl = signal<string | ArrayBuffer | null>(null);

  public readonly id = input.required<number, string>({
    transform: (id) => Number(id),
  });

  private readonly uploadInput = viewChild('uploadInputRef', {
    read: ElementRef<HTMLInputElement>,
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
      data: { dog },
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result) => !!result))
      .subscribe({
        next: () => {
          this.dogResource.reload();
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

  protected onFileSelected(event: Event): void {
    const file: File | undefined = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.uploadError.set('Invalid file type. Only JPG, PNG, and GIF are allowed.');
        this.currentFile.set(null);
        return;
      }

      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > this.MAX_SIZE_MB) {
        this.uploadError.set(`File is too large. Max size is ${this.MAX_SIZE_MB}MB.`);
        this.currentFile.set(null);
        return;
      }

      this.currentFile.set(file);

      const reader = new FileReader();
      reader.onload = (e) => this.previewUrl.set(e.target?.result ?? null);
      reader.readAsDataURL(file);
    }
  }

  protected upload(): void {
    const photo = this.currentFile();

    if (!photo) return;

    this.dogApi.uploadPhoto$(this.id(), photo).subscribe({
      next: () => {
        this.snackBar.open('Dodano zdjęcie');
        this.dogResource.reload();
      },
      error: () => {
        this.snackBar.open('Wystąpił błąd!');
      },
    });
  }

  protected cancel(): void {
    const ref = this.uploadInput();

    if (!ref) return;

    this.uploadError.set(null);
    this.previewUrl.set(null);
    this.currentFile.set(null);
    ref.nativeElement.value = '';
  }
}
