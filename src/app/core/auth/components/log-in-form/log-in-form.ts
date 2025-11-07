import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

//Material
import { MatInput, MatLabel, MatError, MatHint, MatSuffix } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';
import { AuthApiService } from '../../services/auth-api.service';

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
    MatHint,
  ],
})
export class LogInFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);

  protected form = this.fb.group({
    email: this.fb.control<string>('', [Validators.required, Validators.email]),
    password: this.fb.control<string>('', [Validators.required, Validators.minLength(8)]),
  });

  protected hide = signal(true);
  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected showHide(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.hide.set(!this.hide());
  }
  protected logIn() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.value;

    this.authApiService
      .logIn({
        email: email!,
        password: password!,
      })
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: () => {
          console.log('Zalogowano pomyślnie');
          this.authService.setAuthentication(true);
        },
        error: (err: unknown) => {
          console.error(err);
          this.error.set('Niepoprawny e-mail lub hasło.');
        },
      });
  }
}