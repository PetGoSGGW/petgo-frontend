import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-reservation-grid',
  template: ` <ng-content />`,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      /* @media (min-width: 1200px) { */
      /*   :grid { */
      /*     grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); */
      /*   } */
      /* } */
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationGridComponent {}
