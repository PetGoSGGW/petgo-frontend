import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EditDogDetailsDialogData } from '../../models/edit-dog-details-dialog-data.model';

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
  private readonly data = inject<EditDogDetailsDialogData>(MAT_DIALOG_DATA);

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
      breed: this.data.breed.name,
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
