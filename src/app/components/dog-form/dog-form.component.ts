import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Breed } from '../../models/breed.model';
import { EditDogDetailsDialogData } from '../../features/pet-details/components/pet-details/models/edit-dog-details-dialog-data.model';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DogSize } from '../../models/dog.model';

@Component({
  selector: 'app-dog-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dog-form.component.html',
  styleUrl: './dog-form.component.css',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    ReactiveFormsModule,
    FormsModule,
    MatSelect,
    MatOption,
  ],
})
export class DogFormComponent {
  private readonly fb = inject(FormBuilder).nonNullable;

  public readonly breeds = input.required<Breed[]>();
  public readonly initialData = input<EditDogDetailsDialogData>();

  public readonly form = this.fb.group({
    name: this.fb.control('', Validators.required),
    weight: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    breedCode: this.fb.control<Breed['breedCode'] | null>(null, Validators.required),
    size: this.fb.control<DogSize | null>(null, Validators.required),
    notes: this.fb.control(''),
  });

  protected readonly availableSizes = signal(['Mały', 'Średni', 'Duży', 'Olbrzymi']).asReadonly();

  public readonly invalid = outputFromObservable(
    this.form.statusChanges.pipe(map((status) => status === 'INVALID')),
  );

  public readonly value = outputFromObservable(this.form.valueChanges);

  constructor() {
    effect(() => {
      const initialData = this.initialData();

      if (!initialData) return;

      this.form.setValue({
        name: initialData.name,
        weight: initialData.weightKg,
        breedCode: initialData.breed.breedCode,
        size: initialData.size,
        notes: initialData.notes,
      });
    });
  }
}
