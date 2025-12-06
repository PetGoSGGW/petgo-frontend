import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation-list',
  templateUrl: './navigation-list.component.html',
  styleUrl: './navigation-list.component.css',
  imports: [RouterLink, RouterLinkActive],
})
export class NavigationListComponent {}
