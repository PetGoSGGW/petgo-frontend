import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';

export class CustomValidator {
  public static noDotValidator(): ValidatorFn {
    return ({ value }: AbstractControl): ValidationErrors | null => {
      if (!value) {
        return null;
      }

      const hasDot = (value + '').includes('.');

      return hasDot ? { hasDot: true } : null;
    };
  }

  public static minCommaValidator(min: number): ValidatorFn {
    return ({ value }: AbstractControl): ValidationErrors | null => {
      if (value === null || value === '' || value === undefined) {
        return null;
      }

      const numericValue = parseFloat(value.toString().replace(',', '.'));

      if (!isNaN(numericValue) && numericValue < min) {
        return {
          min: { min, actual: numericValue },
        };
      }

      return null;
    };
  }

  public static minDateTodayValidator(): ValidatorFn {
    return ({ value }: AbstractControl): ValidationErrors | null => {
      if (!value) return null;

      // Expecting a Luxon DateTime
      const picked = value as DateTime;

      if (!DateTime.isDateTime(picked)) return null;

      const todayStart = DateTime.now().plus({ day: 1 }).startOf('day');

      if (picked.startOf('day') < todayStart) {
        return { minDate: { min: todayStart.toISODate(), actual: picked.toISODate() } };
      }

      return null;
    };
  }
}
