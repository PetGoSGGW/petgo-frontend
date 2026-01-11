import { Pipe, PipeTransform } from '@angular/core';
import { fromCents } from '../uilts/format-price';

@Pipe({
  name: 'fromCents',
})
export class FromCentsPipe implements PipeTransform {
  public transform(cents: number): string {
    return fromCents(cents);
  }
}
