import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { DateFilterFn, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { finalize, switchMap, tap } from 'rxjs';
import { Dog } from '../../../../models/dog.model';
import { WalkerOffer } from '../../models/walker-offer.model';
import { WalkerOffersApiService } from '../../services/walker-offers-api.service';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { AvailableSlot } from '../../models/available-slot.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { PaymentApiService } from '../../../../services/payment-api.service';
import { DogApiService } from '../../../../services/dog-api.service';
import { AuthService } from '../../../../core/auth/services/auth.service';

export interface WalkerOfferReservationDialogData {
  offerId: WalkerOffer['offerId'];
  slots: AvailableSlot[];
}

@Component({
  selector: 'app-walker-offer-reservation-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButton,
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    DatePipe,
    MatListModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatIconButton,
  ],
  providers: [WalkerOffersApiService, PaymentApiService],
  styles: [
    `
      .form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .slots {
        display: flex;
        flex-direction: column;
        padding: 0 0.5rem;
      }

      .no-date {
        display: flex;
        align-items: center;
      }

      .footer {
        display: flex;
        width: 100%;
        gap: 1rem;

        & > button {
          width: 100%;
        }
      }
    `,
  ],
  template: `
    <span mat-dialog-title>Zarezerwuj</span>
    <mat-dialog-content>
      <form class="form" [formGroup]="form" (ngSubmit)="reserve()">
        <mat-form-field>
          <mat-label>Data</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            [matDatepickerFilter]="dateFilter"
            formControlName="date"
          />
          @if (form.value.date) {
            <button matSuffix matIconButton aria-label="Clear" (click)="resetDate()">
              <mat-icon>close</mat-icon>
            </button>
          }
          <mat-hint>DD.MM.RRRR</mat-hint>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker [touchUi]="isMobile()" #picker></mat-datepicker>
        </mat-form-field>

        <div class="slots">
          @let slotTouched = form.controls.slot.touched;
          @let slotErrors = form.controls.slot.errors;

          <mat-label>Dostępne godziny</mat-label>
          <mat-chip-listbox [value]="form.value.slot" (change)="changeSlot($event)">
            @for (availableSlot of availableSlots(); track availableSlot) {
              <mat-chip-option [disabled]="availableSlot.isReserved" [value]="availableSlot">
                {{ availableSlot.startTime | date: 'dd.MM.yyyy HH:mm' }} -
                {{ availableSlot.endTime | date: 'HH:mm' }}</mat-chip-option
              >
            } @empty {
              <span>Brak dostępnych slotów</span>
            }
          </mat-chip-listbox>

          @if (slotTouched && slotErrors?.['required'] && slots().length > 0) {
            <mat-error>Wybierz slot</mat-error>
          }
        </div>

        <mat-form-field>
          @let dogTouched = form.controls.dog.touched;
          @let dogErrors = form.controls.dog.errors;

          <mat-label>Wybierz pupila</mat-label>
          <mat-select [formControl]="form.controls.dog">
            @for (dog of dogs.value(); track dog.dogId) {
              <mat-option [value]="dog">{{ dog.name }}</mat-option>
            } @empty {
              <mat-option disabled>Brak pupila</mat-option>
            }
          </mat-select>
          @if (dogTouched && dogErrors?.['required']) {
            <mat-error>Wybierz pupila</mat-error>
          }
        </mat-form-field>

        <div class="footer">
          <button type="button" matButton="outlined" (click)="dialogRef.close()">Cofnij</button>
          <button type="submit" matButton="tonal" [disabled]="loading()">Zarezerwuj</button>
        </div>
      </form>
    </mat-dialog-content>
  `,
})
export class WalkerOfferReservationDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly data = inject<WalkerOfferReservationDialogData>(MAT_DIALOG_DATA);
  private readonly walkerOfferApi = inject(WalkerOffersApiService);
  protected readonly matSnackBar = inject(MatSnackBar);
  protected readonly dialogRef = inject(MatDialogRef);
  private readonly paymentApi = inject(PaymentApiService);
  private readonly dogApi = inject(DogApiService);
  private readonly authService = inject(AuthService);

  private readonly userId = this.authService.userId;

  protected readonly offerId = signal(this.data.offerId).asReadonly();
  protected readonly dogs = rxResource({
    params: () => {
      const userId = this.userId();

      if (!userId) return undefined;

      return { ownerId: userId };
    },
    stream: ({ params: { ownerId } }) => this.dogApi.getDogs$(ownerId),
  });

  protected readonly loading = signal(false);

  protected readonly isMobile = signal(
    /Mobi|Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent),
  ).asReadonly;

  protected form = this.fb.group({
    date: this.fb.control<string | null>(null, Validators.required),
    slot: this.fb.control<AvailableSlot | null>(null, {
      validators: Validators.required,
    }),
    dog: this.fb.control<Dog | null>(null, Validators.required),
  });

  protected readonly slots = signal(this.data.slots).asReadonly();

  private readonly dateValue = toSignal(
    this.form.controls.date.valueChanges.pipe(
      tap((date) => {
        const { slot } = this.form.value;

        if (date && slot) {
          const { startTime, endTime } = slot;

          if (!this.compareDates(date, startTime) || !this.compareDates(date, endTime)) {
            this.form.controls.slot.setValue(null);
          }
        }
      }),
    ),
  );

  protected readonly availableSlots = computed(() => {
    const date = this.dateValue();
    const slots = this.slots();

    if (!date) return slots;

    return slots.filter(
      ({ startTime, endTime }) =>
        this.compareDates(startTime, date) && this.compareDates(endTime, date),
    );
  });

  protected dateFilter: DateFilterFn<string | null> = (date): boolean => {
    if (!date) return false;

    const dateFromCalendar = new Date(date);

    if (!dateFromCalendar) return false;
    return this.slots().some(
      ({ startTime, endTime }) =>
        this.compareDates(startTime, dateFromCalendar.toISOString()) ||
        this.compareDates(endTime, dateFromCalendar.toISOString()),
    );
  };

  private compareDates(date: string, compareDate: string): boolean {
    const firstDate = new Date(date);
    const secondDate = new Date(compareDate);

    const firstDateString = `${firstDate.getDate()}/${firstDate.getMonth()}/${firstDate.getFullYear()}`;
    const secondDateString = `${secondDate.getDate()}/${secondDate.getMonth()}/${secondDate.getFullYear()}`;

    return firstDateString === secondDateString;
  }

  protected changeSlot({ value }: MatChipListboxChange): void {
    this.form.controls.slot.setValue(value);

    if (!value && !this.form.value.date) {
      this.form.controls.slot.markAsUntouched();
    }

    const slot = value as AvailableSlot | null;
    if (!slot) return;

    const start = new Date(slot.startTime);
    const x = new Date(start.getFullYear(), start.getMonth(), start.getDate()); // hours/mins/secs = 0

    if (this.form.value.date !== x.toISOString()) {
      this.form.controls.date.setValue(x.toISOString());
    }
  }

  protected resetDate(): void {
    this.form.controls.date.setValue(null);
    this.form.controls.slot.setValue(null);
    this.form.controls.slot.markAsUntouched();
    this.form.controls.slot.markAsPristine();
  }

  protected reserve(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { dog, slot: slot } = this.form.value;

    if (!dog || !slot) return;

    this.loading.set(true);

    this.walkerOfferApi
      .reserve$({
        offerId: this.data.offerId,
        dogId: dog.dogId,
        availabilitySlotIds: [slot.slotId],
      })
      .pipe(
        switchMap(({ reservationId }) => this.paymentApi.initPayment$({ reservationId })),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: ({ paymentUrl }) => {
          window.location.href = paymentUrl;
          this.matSnackBar.open('Zarezerowałeś spacer', 'OK');
          this.dialogRef.close(true);
        },
        error: () => {
          this.matSnackBar.open('Wystąpił błąd podczas rezerwowania.', 'OK');
        },
      });
  }
}
