import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatHint, MatInput, MatSuffix } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatLabel } from '@angular/material/input';
import { MatError } from '@angular/material/input';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatIcon } from '@angular/material/icon';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { AuthApiService } from '../../services/auth-api.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatInput,
    MatFormField,
    MatButton,
    MatLabel,
    MatError,
    MatIcon,
    MatSuffix,
    MatIconButton,
    ReactiveFormsModule,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatHint,
  ],
})
export class SignUpFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authApiService = inject(AuthApiService);

  protected form = this.fb.group(
    {
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: this.fb.control<string>('', [Validators.required]),
      birth: this.fb.control<string | null>(null, [Validators.required]),
    },

    { validators: this.canMatchPasswordValidator('password', 'confirmPassword') },
  );

  protected hide = signal(true);
  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected showHide(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.hide.set(!this.hide());
  }

  protected canMatchPasswordValidator(
    passwordControlName: string,
    confirmPasswordControlName: string,
  ) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get(passwordControlName);
      const confirmPasswordControl = formGroup.get(confirmPasswordControlName);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }

  protected signUp() {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const { email, password, birth } = this.form.value;

    this.authApiService
      .signUp({
        email: email!,
        password: password!,
        birth: birth!,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          console.log('Sign up');
        },
        error: (error: unknown) => {
          this.error.set('unknown');
        },
      });

    this.authService.setAuthentication(true);
  }
}
