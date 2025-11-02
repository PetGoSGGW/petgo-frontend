import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

type ContactForm = {
  topic: FormControl<string>;
  description: FormControl<string>;
  screenshot: FormControl<File | null>;
};

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ContactComponent {
  responseDays = 3;
  contactEmail = 'nasz.email@placeholder.com';

  isSubmitting = false;
  submitSuccess = false;
  previewUrl: string | null = null;

  reportForm: FormGroup<ContactForm>;

  constructor(private fb: FormBuilder) {
    this.reportForm = new FormGroup<ContactForm>({
      topic: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(10)],
      }),
      screenshot: new FormControl<File | null>(null),
    });
  }

  get topicCtrl() {
    return this.reportForm.controls.topic;
  }
  get descriptionCtrl() {
    return this.reportForm.controls.description;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0] ? input.files[0] : null;
    this.reportForm.patchValue({ screenshot: file });

    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.previewUrl = null;
    }
  }

  openMail() {
    window.location.href = `mailto:${this.contactEmail}`;
  }

  async submit() {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.submitSuccess = false;

    // TODO: tu wyślij dane do API (np. HttpClient + FormData)
    await new Promise((r) => setTimeout(r, 800));

    this.isSubmitting = false;
    this.submitSuccess = true;
    this.reportForm.reset();
    this.previewUrl = null;
  }
}
