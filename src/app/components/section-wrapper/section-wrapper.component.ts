import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-wrapper',
  template: `
    <div class="section">
      @if (header()) {
        <h2>{{ header() }}</h2>
      }
      <ng-content />
    </div>
  `,
  styles: [
    `
      .section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background-color: var(--mat-sys-surface);
        padding: 1rem;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        border-radius: 1rem;
        max-width: 128rem;
        margin-inline: auto;
        width: 100%;
      }

      h2 {
        font-weight: bold;
        font-size: 1.15rem;
      }
    `,
  ],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionWrapperComponent {
  public readonly header = input<string>();
}
