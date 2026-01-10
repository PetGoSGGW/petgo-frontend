import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'luxon',
})
export class LuxonPipe implements PipeTransform {
  public transform(
    value: string | null,
    format: 'dd.LL.yyyy HH:mm' | 'dd.LL.yyyy' | 'HH:mm' = 'dd.LL.yyyy',
  ): string | null {
    if (!value) return null;

    return DateTime.fromISO(value).toFormat(format);
  }
}
