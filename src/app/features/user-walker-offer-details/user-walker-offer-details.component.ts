import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { DateTime } from 'luxon';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, finalize, map, take } from 'rxjs';
import { LuxonPipe } from '../../pipes/luxon.pipe';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { UserOfferService } from '../../services/user-offer.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SlotDatePipe } from '../add-walker-offer/pipes/slot-date.pipe';
import { MatIcon } from '@angular/material/icon';
import { CustomValidator } from '../../uilts/custom-validator';
import { UserWalkerOfferDetailsApiService } from './services/user-walker-offer-details-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckbox } from '@angular/material/checkbox';
import { fromCents, toCents } from '../../uilts/format-price';
import { AvailableSlot } from '../walker-offers/models/available-slot.model';
import { LocationService } from '../../services/location.service';
import { UserWalkerOfferDetailsMapComponent } from './components/user-walker-offer-details-map/user-walker-offer-details-map.component';

@Component({
  selector: 'app-user-walker-offer-details',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatLabel,
    MatFormField,
    MatDatepickerModule,
    MatHint,
    MatTimepickerModule,
    LuxonPipe,
    MatInput,
    MatButton,
    MatProgressSpinner,
    MatError,
    SlotDatePipe,
    MatIcon,
    MatCheckbox,
    UserWalkerOfferDetailsMapComponent,
    MatSuffix,
  ],
  template: `
    <div class="main" [class.updating]="updating()">
      @if (loading()) {
        <mat-spinner />
      } @else if (error()) {
        <mat-error>Wystąpił błąd!</mat-error>
      } @else if (offer(); as offer) {
        <div class="section app-page">
          <h2>Szczegóły oferty</h2>

          <form [formGroup]="offerForm">
            <ng-template matStepLabel>Szczegóły oferty</ng-template>

            <mat-form-field>
              @let priceTouched = offerForm.controls.price;
              @let priceErrors = offerForm.controls.price.errors;

              <mat-label>Cena (zł)</mat-label>
              <input matInput formControlName="price" type="text" inputmode="numeric" />

              @if (priceTouched && priceErrors?.['required']) {
                <mat-error>Podaj cenę.</mat-error>
              } @else if (priceTouched && priceErrors?.['min']) {
                <mat-error>Minimalna cena to 0.</mat-error>
              } @else if (priceTouched && priceErrors?.['hasDot']) {
                <mat-error>Nie używaj kropki — użyj przecinka.</mat-error>
              } @else if (priceTouched && priceErrors?.['pattern']) {
                <mat-error>Maksymalnie 2 cyfry po przecinku.</mat-error>
              }
            </mat-form-field>

            <mat-form-field>
              @let descriptionTouched = offerForm.controls.price;
              @let descriptionErrors = offerForm.controls.price.errors;

              <mat-label>Opis</mat-label>
              <textarea matInput formControlName="description"></textarea>

              @if (descriptionTouched && descriptionErrors?.['required']) {
                <mat-error>Napisz opis.</mat-error>
              }
            </mat-form-field>

            <mat-checkbox formControlName="isActive">Check me!</mat-checkbox>

            <button matButton="tonal" [disabled]="loading()" (click)="updateOffer()">
              Zaktualizuj ofertę
            </button>
          </form>
        </div>

        <div class="section app-page">
          <h2>Sloty dostępności</h2>

          @if (location(); as location) {
            <app-user-walker-offer-details-map
              [userPosition]="location"
              [availableSlots]="offer.slots"
            />
          }

          <div class="slots">
            @for (slot of offer.slots; track slot) {
              <button matButton="tonal" (click)="removeSlot(slot)">
                <mat-icon>delete</mat-icon>
                {{ slot | slotDate }}
              </button>
            } @empty {
              <mat-error>Nie dodano slotów dostępności</mat-error>
            }
          </div>

          <form [formGroup]="form">
            <h3>Dodaj slot</h3>
            <mat-form-field>
              <mat-label>Wybierz czas rozpoczęcia</mat-label>
              <input
                matInput
                [matTimepicker]="startTimePicker"
                readonly
                formControlName="startTime"
              />
              <mat-timepicker-toggle matIconSuffix [for]="startTimePicker" />
              <mat-timepicker #startTimePicker />
            </mat-form-field>

            <mat-form-field>
              <mat-label>Wybierz czas zakończenia</mat-label>
              <input matInput readonly [disabled]="true" [value]="endTime() | luxon: 'HH:mm'" />
            </mat-form-field>

            <mat-form-field>
              <mat-label>Wybierz datę</mat-label>
              @let dateTouched = form.controls.date;
              @let dateErrors = form.controls.date.errors;

              <input
                matInput
                [min]="tomorrow"
                [matDatepicker]="datepicker"
                formControlName="date"
              />
              <mat-hint>DD/MM/RRRR</mat-hint>

              @if (dateTouched && dateErrors?.['required']) {
                <mat-error>Wybierz datę.</mat-error>
              } @else if (dateTouched && dateErrors?.['minDate']) {
                <mat-error>Data nie może być wcześniejsza niż dzisiaj.</mat-error>
              }

              <mat-datepicker-toggle matIconSuffix [for]="datepicker"></mat-datepicker-toggle>
              <mat-datepicker #datepicker touchUi></mat-datepicker>
            </mat-form-field>

            <button matButton="outlined" (click)="addSlot()">Dodaj slot</button>
          </form>
        </div>
      }
    </div>
  `,
  styleUrl: './user-walker-offer-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserWalkerOfferDetailsComponent {
  protected readonly fb = inject(FormBuilder);
  private readonly userOfferSerice = inject(UserOfferService);
  private readonly userWalkerOfferDetailsApi = inject(UserWalkerOfferDetailsApiService);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly locationService = inject(LocationService);

  public readonly loading = this.userOfferSerice.loading;
  public readonly offer = this.userOfferSerice.offer;
  public readonly error = this.userOfferSerice.error;

  protected readonly updating = signal(false);

  protected readonly tomorrow = DateTime.now().plus({ day: 1 }).startOf('day');

  protected readonly location = toSignal(
    this.locationService.getCurrentLocation$().pipe(
      map(({ latitude, longitude }) => ({ latitude, longitude })),
      filter((coordinates) => !!coordinates),
    ),
  );

  protected offerForm = this.fb.group({
    price: this.fb.control<string | null>(null, [
      Validators.required,
      CustomValidator.minCommaValidator(0),
      Validators.pattern(/^[0-9]+(,[0-9]{1,2})?$/),
      CustomValidator.noDotValidator(),
    ]),
    description: this.fb.control<string | null>(null, Validators.required),
    isActive: this.fb.control<boolean>(true, { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const offer = this.offer();

      if (offer) {
        this.offerForm.setValue({
          price: fromCents(offer.priceCents),
          description: offer.description,
          isActive: offer.isActive,
        });
      }
    });
  }

  protected form = this.fb.group({
    startTime: this.fb.control<DateTime | null>(null, Validators.required),
    date: this.fb.control<DateTime | null>(null, [
      Validators.required,
      CustomValidator.minDateTodayValidator(),
    ]),
  });

  protected readonly endTime = toSignal(
    this.form.controls.startTime.valueChanges.pipe(
      map((value: DateTime | null) => (value ? value.plus({ minute: 30 }) : null)),
      map((value) => value?.toISO() ?? null),
    ),
    { initialValue: null },
  );

  protected removeSlot({ slotId }: AvailableSlot): void {
    this.updating.set(true);
    this.userWalkerOfferDetailsApi
      .removeSlot$(slotId)
      .pipe(finalize(() => this.updating.set(false)))
      .subscribe({
        next: () => {
          this.userOfferSerice.reload();
          this.matSnackBar.open('Usunięto slot dostępności', 'OK');
        },
        error: () => {
          this.matSnackBar.open('Wystąpił błąd', 'OK');
        },
      });
  }

  protected addSlot(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { startTime, date } = this.form.value;
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

    this.updating.set(true);

    const location = this.location();

    if (!location) return;

    const { latitude, longitude } = location;

    this.userWalkerOfferDetailsApi
      .addSlot$([
        {
          startTime: startDate.toISO() ?? '',
          endTime: endDate.toISO() ?? '',
          latitude,
          longitude,
        },
      ])
      .pipe(
        take(1),
        finalize(() => this.updating.set(false)),
      )
      .subscribe({
        next: () => {
          this.userOfferSerice.reload();

          this.form.reset({ startTime: null, date: null });

          this.form.markAsPristine();
          this.form.markAsUntouched();

          Object.values(this.form.controls).forEach((control) => {
            control.setErrors(null);
            control.markAsPristine();
            control.markAsUntouched();
          });

          this.form.setErrors(null);
          this.form.updateValueAndValidity();

          this.matSnackBar.open('Dodano slot dostępności', 'OK');
        },
        error: () => {
          this.matSnackBar.open('Wystąpił bład', 'OK');
        },
      });
  }

  protected updateOffer(): void {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      return;
    }

    const { price, description, isActive } = this.offerForm.value;

    if (!price || !description || isActive === undefined) return;

    this.updating.set(true);

    this.userWalkerOfferDetailsApi
      .updateOffer$({
        priceCents: toCents(price),
        description,
        isActive,
      })
      .pipe(finalize(() => this.updating.set(false)))
      .subscribe({
        next: () => {
          this.userOfferSerice.reload();

          this.matSnackBar.open('Zaktualizowano ofertę');
        },
        error: () => {
          this.matSnackBar.open('Wystąpił błąd', 'OK');
        },
      });
  }
}
