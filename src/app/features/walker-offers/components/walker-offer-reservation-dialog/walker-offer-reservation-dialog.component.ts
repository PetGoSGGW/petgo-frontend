import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel, MatError } from '@angular/material/form-field';
import { finalize } from 'rxjs';
import { Dog } from '../../../../models/dog.model';
import { WalkerOffer } from '../../models/walker-offer.model';
import { WalkerOffersApiService } from '../../services/walker-offers-api.service';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatOption, MatSelect } from '@angular/material/select';
import { AvailableSlot } from '../../models/available-slot.model';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface WalkerOfferReservationDialogData {
  offerId: WalkerOffer['offerId'];
  slots: AvailableSlot[];
}

@Component({
  selector: 'app-walker-offer-reservation-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatFormField,
    MatHint,
    MatDatepicker,
    MatLabel,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatButton,
    ReactiveFormsModule,
    FormsModule,
    MatChipListbox,
    MatChipOption,
    DatePipe,
    MatError,
    MatListModule,
    MatSelect,
    MatOption,
  ],
  styles: [``],
  template: `
    <span mat-dialog-title>Zarezerwuj</span>
    <mat-dialog-content>
      <form [formGroup]="form" (ngSubmit)="$event.preventDefault(); reserve()">
        <mat-form-field>
          <mat-label>Data</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" />
          <mat-hint>DD.MM.RRRR</mat-hint>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker [touchUi]="isMobile()" #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field>
          @let slotTouched = form.controls.slots.touched;
          @let slotErrors = form.controls.slots.errors;

          <mat-label>Dostępne godziny</mat-label>
          @if (slots.hasValue()) {
            <mat-chip-listbox>
              @for (availableSlot of availableSlots(); track availableSlot) {
                <mat-chip-option [disabled]="availableSlot.isReserved" [value]="availableSlot">
                  {{ availableSlot.startTime | date: 'dd.MM.yyyy' }} -
                  {{ availableSlot.endTime | date: 'dd.MM.yyyy' }}</mat-chip-option
                >
              } @empty {
                <span>Brak dostępnych slotów</span>
              }
            </mat-chip-listbox>
          } @else if (slots.isLoading()) {
            <span>Ładowanie...</span>
          } @else if (slots.error()) {
            <mat-error>Błąd.</mat-error>
          }
          @if (slotTouched && slotErrors?.['required']) {
            <mat-error>Wybierz slot</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Wybierz pupila</mat-label>
          @let dogTouched = form.controls.dog.touched;
          @let dogErrors = form.controls.dog.errors;

          <mat-select formControlName="dog">
            @for (dog of dogs(); track dog.dogId) {
              <mat-option [value]="dog">{{ dog.name }}</mat-option>
            }
          </mat-select>
          @if (dogTouched && dogErrors?.['required']) {
            <mat-error>Wybierz pupila</mat-error>
          }
        </mat-form-field>

        <button type="submit" matButton="tonal">Zarezerwuj</button>
      </form>
    </mat-dialog-content>
  `,
})
export class WalkerOfferReservationDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly data = inject<WalkerOfferReservationDialogData>(MAT_DIALOG_DATA);
  private readonly walkerOfferApi = inject(WalkerOffersApiService);
  protected readonly matSnackBar = inject(MatSnackBar);
  private readonly dialogRef = inject(MatDialogRef);

  protected readonly offerId = signal(this.data.offerId).asReadonly();
  protected readonly dogs = signal<Dog[]>([]);

  protected readonly loading = signal(false);

  protected readonly isMobile = signal(
    /Mobi|Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent),
  ).asReadonly;

  protected form = this.fb.group({
    date: this.fb.control<string | null>(null, Validators.required),
    slots: this.fb.control<AvailableSlot[]>([], {
      validators: Validators.required,
      nonNullable: true,
    }),
    dog: this.fb.control<Dog | null>(null, Validators.required),
  });

  private readonly dateValue = toSignal(this.form.controls.date.valueChanges);

  protected readonly availableSlots = computed(() => {
    const date = this.dateValue();
    const slots = this.slots.hasValue() ? this.slots.value() : [];

    if (slots.length === 0 || !date) return [];

    return slots.filter(
      ({ startTime, endTime }) =>
        this.compareDates(startTime, date) && this.compareDates(endTime, date),
    );
  });

  protected slots = rxResource({
    params: () => ({ offerId: this.offerId() }),
    stream: ({ params: { offerId } }) => this.walkerOfferApi.getAvailableSlots(offerId),
  });

  private compareDates(date: string, compareDate: string): boolean {
    const firstDate = new Date(date);
    const secondDate = new Date(compareDate);

    const firstDateString = `${firstDate.getDate()}/${firstDate.getMonth()}/${firstDate.getFullYear()}`;
    const secondDateString = `${secondDate.getDate()}/${secondDate.getMonth()}/${secondDate.getFullYear()}`;

    return firstDateString === secondDateString;
  }

  protected reserve(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { dog, slots } = this.form.value;

    if (!dog || !slots) return;

    this.loading.set(true);

    this.walkerOfferApi
      .reserve({
        offerId: this.data.offerId,
        dogId: dog.dogId,
        availablilitySlots: slots.map(({ slotId }) => slotId),
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.matSnackBar.open('Wystąpił błąd podczas rezerwowania.', 'OK');
        },
      });
  }
}
