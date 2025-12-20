import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly snackbar = inject(MatSnackBar);

  public readonly responseDays = signal(3);
  public readonly contactEmail = signal('nasz.email1@placeholder.com');

  public readonly isSubmitting = signal(false);
  public readonly submitSuccess = signal(false);
  public readonly previewUrl = signal<string | null>(null);

  public readonly reportForm = this.fb.group({
    topic: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)],
    }),
    description: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(1000)],
    }),
    screenshot: this.fb.control<File | null>(null),
  });

  public get topicControl(): FormControl<string> {
    return this.reportForm.controls.topic;
  }

  public get descriptionControl(): FormControl<string> {
    return this.reportForm.controls.description;
  }

  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0] ? input.files[0] : null;
    this.reportForm.patchValue({ screenshot: file });

    if (file) {
      const reader = new FileReader();
      reader.onload = (): void => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.previewUrl.set(null);
    }
  }

  public openMail(): void {
    window.location.href = `mailto:${this.contactEmail()}`;
  }

  public async submit(): Promise<void> {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);

    // TODO: wysłanie danych do API
    await new Promise<void>((r) => setTimeout(r, 800));

    this.isSubmitting.set(false);
    this.snackbar.open(
      `Dziękujemy! Twoje zgłoszenie zostało przyjęte. Odpowiemy w ciągu ${this.responseDays()} dni.`,
      'OK',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      },
    );
    this.reportForm.reset();
    this.previewUrl.set(null);
  }
}
