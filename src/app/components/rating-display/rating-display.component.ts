import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-rating-display',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './rating-display.component.html',
  styleUrl: './rating-display.component.css',
})
export class RatingDisplayComponent {
  public readonly rating = input.required<number>();
  public readonly reviewCount = input.required<number>();
  public readonly size = input<'small' | 'medium' | 'large'>('medium');

  protected readonly stars = [1, 2, 3, 4, 5];

  protected getStarIcon(index: number): string {
    const rating = this.rating();

    if (rating >= index) {
      return 'star';
    } else if (rating >= index - 0.5) {
      return 'star_half';
    } else {
      return 'star_border';
    }
  }
}
