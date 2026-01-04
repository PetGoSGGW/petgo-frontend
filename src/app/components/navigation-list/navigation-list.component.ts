import { Component, inject, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserOfferService } from '../../services/user-offer.service';

@Component({
  selector: 'app-navigation-list',
  templateUrl: './navigation-list.component.html',
  styleUrl: './navigation-list.component.css',
  imports: [RouterLink, RouterLinkActive, MatIcon, MatButton],
})
export class NavigationListComponent {
  private readonly userOfferService = inject(UserOfferService);

  public clicked = output<void>();

  public loading = this.userOfferService.loading;
  public hasOffer = this.userOfferService.hasOffer;
}
