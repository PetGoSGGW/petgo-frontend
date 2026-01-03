import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

export type MapControlAction = 'center' | 'zoom-in' | 'zoom-out';

@Component({
  selector: 'app-map-controls',
  template: `
    <div class="controls">
      <button matMiniFab [attr.aria-label]="'przybliż'" (click)="clicked.emit('zoom-in')">
        <mat-icon>zoom_in</mat-icon>
      </button>

      <button matMiniFab [attr.aria-label]="'oddal'" (click)="clicked.emit('zoom-out')">
        <mat-icon>zoom_out</mat-icon>
      </button>

      <button matMiniFab [attr.aria-label]="'wyśrodkuj'" (click)="clicked.emit('center')">
        <mat-icon>center_focus_weak</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .controls {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatMiniFabButton, MatIcon],
})
export class MapControlsComponent {
  public readonly clicked = output<MapControlAction>();
}
