import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { WalletApiService } from '../../../../services/wallet-api.service';
import { Wallet } from '../../../../models/wallet.model';
import { toCents } from '../../../../uilts/format-price';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomValidator } from '../../../../uilts/custom-validator';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FromCentsPipe } from '../../../../pipes/from-cents.pipe';

@Component({
  selector: 'app-wallet-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.action === 'deposit' ? 'Wpłata' : 'Wypłata' }}</h2>
    <mat-dialog-content>
      <div class="balance">Stan konta: {{ data.wallet.balanceCents | fromCents }} zł</div>
      <mat-form-field>
        <mat-label>Kwota</mat-label>
        <input matInput [formControl]="amountFc" />
        @if (amountFc.touched && amountFc.errors?.['required']) {
          <mat-error>Podaj cenę.</mat-error>
        } @else if (amountFc.touched && amountFc.errors?.['min']) {
          <mat-error> Minimalna cena to 1 zł</mat-error>
        } @else if (amountFc.touched && amountFc.errors?.['max']) {
          <mat-error> Kwota przekracza stan konta </mat-error>
        } @else if (amountFc.touched && amountFc.errors?.['hasDot']) {
          <mat-error>Nie używaj kropki — użyj przecinka.</mat-error>
        } @else if (amountFc.touched && amountFc.errors?.['pattern']) {
          <mat-error>Maksymalnie 2 cyfry po przecinku.</mat-error>
        }
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton (click)="dialogRef.close()">Zamknij</button>
      <button matButton="tonal" (click)="submit()">
        {{ data.action === 'deposit' ? 'Wpłać' : 'Wypłać' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      input {
        width: 100%;
      }

      mat-form-field {
        width: 100%;
      }

      .balance {
        margin-bottom: 1rem;
      }
    `,
  ],
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    MatInput,
    MatButton,
    FromCentsPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletDialogComponent implements OnInit {
  protected readonly dialogRef = inject(MatDialogRef);
  private readonly walletApi = inject(WalletApiService);
  private readonly matSnackBar = inject(MatSnackBar);

  protected readonly data = inject<WalletDialogData>(MAT_DIALOG_DATA);

  protected amountFc = new FormControl<string>('', {
    validators: [
      Validators.required,
      CustomValidator.minCommaValidator(1),
      Validators.pattern(/^[0-9]+(,[0-9]{1,2})?$/),
      CustomValidator.noDotValidator(),
    ],
    nonNullable: true,
  });

  public ngOnInit(): void {
    if (this.data.action === 'withdraw') {
      this.amountFc.addValidators(
        CustomValidator.maxCommaValidator(this.data.wallet.balanceCents / 100),
      );
    }
  }

  protected submit(): void {
    if (this.amountFc.invalid) {
      this.amountFc.markAsTouched();
      return;
    }

    if (!this.amountFc.value) return;

    const amountCents = toCents(this.amountFc.value);

    (this.data.action === 'deposit'
      ? this.walletApi.depositMoney$(this.data.wallet.walletId, {
          amountCents,
          description: 'Wpłata pieniędzy',
        })
      : this.walletApi.withdrawMoney$(this.data.wallet.walletId, {
          amountCents,
          description: 'Wypłata pieniędzy',
        })
    ).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.matSnackBar.open(
          this.data.action === 'deposit' ? 'Wpłacono pieniądze' : 'Wypłacono pieniądze',
          'OK',
        );
      },
      error: () => {
        this.matSnackBar.open('Wystąpił błąd', 'OK');
      },
    });
  }
}

export interface WalletDialogData {
  action: 'deposit' | 'withdraw';
  wallet: Wallet;
}
