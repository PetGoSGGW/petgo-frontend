import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DogFormComponent } from '../../../../components/dog-form/dog-form.component';
import { MatButton } from '@angular/material/button';
import { DogApiService } from '../../../../services/dog-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-add-dog-form-dialog',
  templateUrl: './add-dog-form-dialog.componenet.html',
  styleUrl: './add-dog-form-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DogFormComponent,
    MatButton,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatProgressSpinner,
    MatError,
  ],
})
export class AddDogFormDialogComponent {
  private readonly dogApi = inject(DogApiService);
  private readonly matSnackBar = inject(MatSnackBar);

  protected readonly matDialogRef = inject(MatDialogRef);

  private readonly formRef = viewChild.required(DogFormComponent);

  protected breeds = rxResource({
    stream: () => this.dogApi.getBreeds$(),
  });

  protected submit(): void {
    this.formRef().form.markAllAsTouched();

    if (this.formRef().form.invalid) return;

    const { breedCode: breedCode, name, weight, notes, size } = this.formRef().form.value;

    if (!breedCode || !name || !weight || !notes || !size) return;

    this.dogApi
      .addDog$({
        name,
        breedCode,
        size,
        notes,
        weightKg: weight,
      })
      .subscribe({
        next: () => {
          this.matSnackBar.open('Dodano pupila', 'OK');
          this.matDialogRef.close(true);
        },
        error: () => {
          this.matSnackBar.open('Wystąpił błąd', 'OK');
        },
      });
  }
}
