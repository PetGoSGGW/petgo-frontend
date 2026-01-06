import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCard, MatCardContent, MatCardImage } from '@angular/material/card';
import { Dog } from '../../models/dog.model';

@Component({
  selector: 'app-dogs-grid',
  template: `
    <div class="dogs">
      @for (dog of dogs(); track dog.dogId) {
        <mat-card>
          <img mat-card-image [src]="dog.photos.at(0)?.url" [alt]="dog.name" />
          <mat-card-content>
            <h2>{{ dog.name }}</h2>
            <div class="dog-details-line">
              <span>{{ dog.breed.name }}</span>
              <span>{{ dog.size }}, {{ dog.weightKg }}kg</span>
            </div>

            <p>{{ dog.notes }}</p>
          </mat-card-content>
        </mat-card>
      } @empty {
        <ng-content />
      }
    </div>
  `,
  styleUrl: 'dogs-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCard, MatCardContent, MatCardImage],
})
export class DogsGridComponent {
  public readonly dogs = input.required<Dog[]>();
}
