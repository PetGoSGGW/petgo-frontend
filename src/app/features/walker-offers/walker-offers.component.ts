import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WalkerOffersService } from './services/walker-offers.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-walker-offers',
  imports: [FormsModule, MatIcon, MatProgressSpinner, MatButton],
  templateUrl: './walker-offers.component.html',
  styleUrl: './walker-offers.component.css',
})
export class OffersComponent {
  private readonly offersService = inject(WalkerOffersService);
  protected readonly search = signal('');
  protected readonly stars = new Array(5);

  protected offers = rxResource({
    params: () => ({ search: this.search() }),
    stream: ({ params: { search } }) => this.offersService.getOffers(search),
  });

  protected reserve(name: string): void {
    alert(`Zarezerwowano: ${name}`);
  }
}
