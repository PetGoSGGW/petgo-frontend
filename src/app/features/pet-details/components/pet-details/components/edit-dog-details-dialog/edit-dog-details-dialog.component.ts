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
            [initialData]="data"
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
  protected readonly data = inject<EditDogDetailsDialogData>(MAT_DIALOG_DATA);
  private readonly dogApi = inject(DogApiService);

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

    this.dialogRef.close(this.value());
  }
}

export interface EditDogDialogResult {
  name: string;
  breed: string;
  notes: string;
  size: string;
  weightKg: number;
  isActive: boolean;
}
