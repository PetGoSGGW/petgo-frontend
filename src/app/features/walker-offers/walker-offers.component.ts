import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WalkerOffersApiService } from './services/walker-offers-api.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { WalkerOffer } from './models/walker-offer.model';

@Component({
  selector: 'app-walker-offers',
  imports: [FormsModule, MatIcon, MatProgressSpinner, MatButton],
  templateUrl: './walker-offers.component.html',
  styleUrl: './walker-offers.component.css',
})
export class OffersComponent {
  private router = inject(Router);
  private readonly offersService = inject(WalkerOffersApiService);
  protected readonly search = signal('');
  protected readonly stars = new Array(5);

  protected offers = rxResource({
    params: () => ({ search: this.search() }),
    stream: ({ params: { search } }) => this.offersService.getOffers(search),
  });

  protected async reserve(offer: WalkerOffer): Promise<void> {
    await this.router.navigate(['/rezerwacja'], {
      state: { rezerwacja: offer },
    });
  }
}
