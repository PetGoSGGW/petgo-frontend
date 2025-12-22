import { Component, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation-list',
  templateUrl: './navigation-list.component.html',
  styleUrl: './navigation-list.component.css',
  imports: [RouterLink, RouterLinkActive, MatIcon],
})
export class NavigationListComponent {
  public clicked = output<void>();
}
