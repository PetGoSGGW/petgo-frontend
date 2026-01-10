import { Pipe, PipeTransform } from '@angular/core';
import { Slot } from '../add-walker-offer.component';
import { DateTime } from 'luxon';
import { AvailableSlot } from '../../walker-offers/models/available-slot.model';

@Pipe({
  name: 'slotDate',
})
export class SlotDatePipe implements PipeTransform {
  public transform(slot?: Slot | AvailableSlot): string {
    if (!slot) return '';

    if ('start' in slot) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return `${DateTime.fromISO(slot.start!).toFormat('dd.LL.yyyy HH:mm')} - ${DateTime.fromISO(slot.end!).toFormat('HH:mm')}`;
    }

    if ('startTime' in slot) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return `${DateTime.fromISO(slot.startTime!).toFormat('dd.LL.yyyy HH:mm')} - ${DateTime.fromISO(slot.endTime!).toFormat('HH:mm')}`;
    }

    return '';
  }
}
