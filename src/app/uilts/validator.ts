import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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
}
