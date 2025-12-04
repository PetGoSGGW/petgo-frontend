import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatInput, MatSuffix } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatLabel } from '@angular/material/input';
import { MatError } from '@angular/material/input';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { AuthApiService } from '../../services/auth-api.service';
import { finalize } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
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
    RouterLink,
    MatStepper,
    MatStep,
    MatStepperNext,
    MatStepperPrevious,
    MatStepLabel,
  ],
})
export class RegisterFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected personalDetailsForm = this.fb.group({
    firstName: this.fb.control<string>('', [Validators.required]),
    lastName: this.fb.control<string>('', [Validators.required]),
    username: this.fb.control<string>('', [Validators.required]),
  });

  protected accountForm = this.fb.group(
    {
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: this.fb.control<string>('', [Validators.required]),
    },

    { validators: this.canMatchPasswordValidator('password', 'confirmPassword') },
  );

  protected readonly hidePassword = signal(true);
  protected readonly hidePasswordConfirmation = signal(true);
  protected readonly loading = signal(false);

  protected showHide(event: MouseEvent, field: 'password' | 'password-confirmation'): void {
    event.stopPropagation();
    event.preventDefault();

    switch (field) {
      case 'password':
        this.hidePassword.update((hide) => !hide);
        break;
      case 'password-confirmation':
        this.hidePasswordConfirmation.update((hide) => !hide);
        break;
    }
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

  protected register(): void {
    this.accountForm.markAllAsTouched();
    this.personalDetailsForm.markAllAsTouched();

    if (this.accountForm.invalid) return;

    const { email, password } = this.accountForm.value;

    const { lastName, firstName, username } = this.personalDetailsForm.value;

    if (!email || !password || !lastName || !firstName || !username) return;

    this.loading.set(true);

    this.authApiService
      .register({
        email: email.trim(),
        password: password.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: async (session) => {
          this.authService.saveSession(session);

          await this.router.navigate(['/']);

          this.snackBar.open('Zostałeś zarejestrowany');
        },
        error: () => {
          this.snackBar.open('Błąd podczas rejestracji');
        },
      });
  }
}
