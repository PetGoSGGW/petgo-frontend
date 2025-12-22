import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DogFormComponent } from '../../../../components/dog-form/dog-form.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-add-dog-form-dialog',
  templateUrl: './add-dog-form-dialog.componenet.html',
  styleUrl: './add-dog-form-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DogFormComponent, MatButton, MatDialogTitle, MatDialogContent, MatDialogActions],
})
export class AddDogFormDialogComponent {
  protected readonly matDialogRef = inject(MatDialogRef);

  private readonly formRef = viewChild.required(DogFormComponent);

  protected submit(): void {
    this.formRef().form.markAllAsTouched();

    if (this.formRef().form.invalid) return;

    this.matDialogRef.close(true);
  }
}
