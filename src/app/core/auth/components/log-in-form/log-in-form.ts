import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { MatInput, MatLabel, MatError, MatSuffix } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';
import { AuthApiService } from '../../services/auth-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-log-in-form',
  standalone: true,
  templateUrl: './log-in-form.html',
  styleUrl: './log-in-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatButton,
    MatLabel,
    MatError,
    MatIcon,
    MatSuffix,
    MatIconButton,
    RouterLink,
  ],
})
export class LogInFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected form = this.fb.group({
    email: this.fb.control<string>('', [Validators.required, Validators.email]),
    password: this.fb.control<string>('', Validators.required),
  });

  protected readonly hide = signal(true);
  protected readonly loading = signal(false);

  protected showHide(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.hide.set(!this.hide());
  }
  protected login(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);

    const { email, password } = this.form.value;

    this.authApiService
      .login({
        email: email ?? '',
        password: password ?? '',
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: async (session) => {
          this.authService.saveSession(session);

          await this.router.navigate(['/']);

          this.snackBar.open('Zalogowano pomyślnie');
        },
        error: () => {
          this.snackBar.open('Niepoprawny e-mail lub hasło.');
        },
      });
  }
}
