import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AddWalkerOfferApiService } from './services/add-walker-offer-api.service';
import { LocationService } from '../../services/location.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, finalize, map, switchMap, take } from 'rxjs';
import { DateTime } from 'luxon';
import { LuxonPipe } from '../../pipes/luxon.pipe';
import { SlotDatePipe } from './pipes/slot-date.pipe';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserOfferService } from '../../services/user-offer.service';
import { CustomValidator } from '../../uilts/custom-validator';
import { toCents } from '../../uilts/format-price';

export interface Slot {
  start: string | null;
  end: string | null;
}

@Component({
  selector: 'app-add-walker-offer',
  templateUrl: './add-walker-offer.component.html',
  styleUrl: './add-walker-offer.component.css',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
    MatError,
    MatButton,
    MatStep,
    MatStepper,
    MatTimepickerModule,
    MatStepperNext,
    MatDatepickerModule,
    MatHint,
    MatDivider,
    MatStepperPrevious,
    MatSuffix,
    LuxonPipe,
    SlotDatePipe,
    MatIcon,
    MatButton,
    MatStepLabel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddWalkerOfferComponent {
  private readonly addWalkerOfferApi = inject(AddWalkerOfferApiService);
  private readonly locationService = inject(LocationService);
  protected readonly fb = inject(FormBuilder);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly userOfferService = inject(UserOfferService);

  protected readonly loading = signal(false);
  protected readonly tomorrow = DateTime.now().plus({ day: 1 }).startOf('day');

  protected offerForm = this.fb.group({
    price: this.fb.control<string | null>(null, [
      Validators.required,
      CustomValidator.minCommaValidator(0),
      Validators.pattern(/^[0-9]+(,[0-9]{1,2})?$/),
      CustomValidator.noDotValidator(),
    ]),
    description: this.fb.control<string | null>(null, Validators.required),
  });

  protected slotsControl = this.fb.control<Slot[]>([], {
    nonNullable: true,
    validators: [Validators.required],
  });

  protected slotForm = this.fb.group({
    startTime: this.fb.control<DateTime | null>(null, Validators.required),
    date: this.fb.control<DateTime | null>(null, [
      Validators.required,
      CustomValidator.minDateTodayValidator(),
    ]),
  });

  protected readonly endTime = toSignal(
    this.slotForm.controls.startTime.valueChanges.pipe(
      map((value: DateTime | null) => (value ? value.plus({ minute: 30 }) : null)),
      map((value) => value?.toISO() ?? null),
    ),
    { initialValue: null },
  );

  protected removeSlot(index: number): void {
    this.slotsControl.setValue(this.slotsControl.value.filter((_, i) => i !== index));
  }

  protected addSlot(): void {
    if (this.slotForm.invalid) {
      this.slotForm.markAllAsTouched();
      return;
    }

    const { startTime, date } = this.slotForm.value;
    const stringifyEndTime = this.endTime();

    const startDate = date?.set({
      hour: startTime?.hour,
      minute: startTime?.minute,
    });

    if (!stringifyEndTime) return;

    const endTime = DateTime.fromISO(stringifyEndTime);

    const endDate = date?.set({
      hour: endTime.hour,
      minute: endTime.minute,
    });

    if (!startDate || !endDate) return;

    const slot = {
      start: startDate.toISO(),
      end: endDate.toISO(),
    } satisfies Slot;

    this.slotsControl.setValue([...(this.slotsControl.value ?? []), slot]);
    this.slotForm.reset({ startTime: null, date: null });

    this.slotForm.markAsPristine();
    this.slotForm.markAsUntouched();

    Object.values(this.slotForm.controls).forEach((control) => {
      control.setErrors(null);
      control.markAsPristine();
      control.markAsUntouched();
    });

    this.slotForm.setErrors(null);
    this.slotForm.updateValueAndValidity();
  }

  protected submit(): void {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      return;
    }

    const { price, description } = this.offerForm.value;

    if (!price || !description) return;

    this.loading.set(true);

    this.addWalkerOfferApi
      .addOffer$({
        priceCents: toCents(price),
        description,
      })
      .pipe(
        switchMap(() =>
          this.locationService.getCurrentLocation$().pipe(filter((location) => !!location)),
        ),
        switchMap(() =>
          this.addWalkerOfferApi.addSlots$(
            this.slotsControl.value.map((value) => ({
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              startTime: value.start!,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              endTime: value.end!,
              latitude: 0,
              longitude: 0,
            })),
          ),
        ),
        take(1),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: async () => {
          this.matSnackBar.open('Dodano ofertę', 'OK');
          this.userOfferService.reload();
          await this.router.navigate(['/moja-oferta']);
        },
        error: () => {
          this.matSnackBar.open('Wystąpił błąd', 'OK');
        },
      });
  }
}
