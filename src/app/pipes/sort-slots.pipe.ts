import { Pipe, PipeTransform } from '@angular/core';
import { AvailableSlot } from '../features/walker-offers/models/available-slot.model';

@Pipe({
  name: 'sortSlots',
})
export class SortSlotsPipe implements PipeTransform {
  public transform(slots: AvailableSlot[]): AvailableSlot[] {
    return slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
}
