import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCard, MatCardContent, MatCardImage, MatCardFooter } from '@angular/material/card';
import { Dog } from '../../models/dog.model';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dogs-grid',
  template: `
    <div class="dogs">
      @for (dog of dogs(); track dog.dogId) {
        <mat-card>
          @if (dog.photos.length > 0) {
            <img mat-card-image [src]="apiUrl + dog.photos.at(0)?.url" [alt]="dog.name" />
          } @else {
            <mat-icon class="img-placeholder">pets</mat-icon>
          }
          <mat-card-content>
            <h2>{{ dog.name }}</h2>
            <div class="dog-details-line">
              <span>{{ dog.breed.name }}</span>
              <span>{{ dog.size }}, {{ dog.weightKg }}kg</span>
            </div>

            <p>{{ dog.notes }}</p>
          </mat-card-content>
          <mat-card-footer>
            <a matButton="tonal" [routerLink]="['/pupile', dog.dogId]">Zobacz</a>
          </mat-card-footer>
        </mat-card>
      } @empty {
        <ng-content />
      }
    </div>
  `,
  styleUrl: 'dogs-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCard, MatCardContent, MatCardImage, MatCardFooter, MatAnchor, RouterLink, MatIcon],
})
export class DogsGridComponent {
  public readonly dogs = input.required<Dog[]>();
  protected readonly apiUrl = environment.apiUrl;
}
