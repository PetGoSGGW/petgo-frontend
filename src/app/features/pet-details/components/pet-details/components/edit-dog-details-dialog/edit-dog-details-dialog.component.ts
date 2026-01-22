import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EditDogDetailsDialogData } from '../../models/edit-dog-details-dialog-data.model';
import {
  DogForm,
  DogFormComponent,
} from '../../../../../../components/dog-form/dog-form.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { DogApiService } from '../../../../../../services/dog-api.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Dog } from '../../../../../../models/dog.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    DogFormComponent,
    MatProgressSpinner,
  ],
  template: `
    <div class="modal-container">
      <h2 mat-dialog-title>Edytuj szczegóły psa</h2>

      <div mat-dialog-content class="content">
        @if (breeds.isLoading()) {
          <mat-spinner />
        } @else if (breeds.error()) {
          <mat-error>Wystąpił błąd!</mat-error>
        } @else if (breeds.hasValue()) {
          <app-dog-form
            [initialData]="initialData"
            (invalid)="invalid.set($event)"
            (value)="value.set($event)"
            [breeds]="breeds.value()"
          />
        }
      </div>

      <div class="actions" mat-dialog-actions align="end">
        <button matButton="outlined" type="button" (click)="close()">Anuluj</button>
        <button
          matButton="tonal"
          color="primary"
          type="button"
          (click)="save()"
          [disabled]="invalid()"
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

      .content {
        margin-top: 1rem;
      }

      .actions {
        display: flex;
        flex-direction: flex-end;
        width: 100%;
        gap: 1rem;

        button {
          width: 100%;
        }
      }
    `,
  ],
  providers: [DogApiService],
})
export class EditDogDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<EditDogDialogComponent>);
  protected readonly data = inject<{ dog: Dog }>(MAT_DIALOG_DATA);
  private readonly dogApi = inject(DogApiService);
  private readonly matSnackBar = inject(MatSnackBar);

  protected readonly initialData: EditDogDetailsDialogData = {
    name: this.data.dog.name,
    isActive: this.data.dog.isActive,
    size: this.data.dog.size,
    weightKg: this.data.dog.weightKg,
    notes: this.data.dog.notes,
    breed: this.data.dog.breed,
  };
  protected readonly invalid = signal(true);
  protected readonly value = signal<DogForm | null>(null);

  protected breeds = rxResource({
    stream: () => this.dogApi.getBreeds$(),
  });

  public close(): void {
    this.dialogRef.close();
  }

  public save(): void {
    if (this.invalid()) return;

    const value = this.value();

    if (!value) return;

    this.dogApi
      .updateDog$(this.data.dog.dogId, {
        name: value.name,
        isActive: !!value.isActive,
        size: value.size ?? 'Mały',
        notes: value.notes,
        weightKg: value.weight ?? 0,
        breedCode: this.data.dog.breed.breedCode,
      })
      .subscribe({
        next: () => {
          this.matSnackBar.open('Zapisano zmiany w profilu psa.', 'OK');
          this.dialogRef.close(true);
        },
        error: () => {
          this.matSnackBar.open('Nie udało się zapisać zmian.', 'OK');
        },
      });
  }
}
