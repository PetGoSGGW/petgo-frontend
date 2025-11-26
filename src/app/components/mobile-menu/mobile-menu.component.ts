import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NavigationListComponent } from '../navigation-list/navigation-list.component';
import { RouterLink } from '@angular/router';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.css',
  imports: [MatIconButton, MatIcon, NavigationListComponent, RouterLink, MatDivider],
})
export class MobileMenuComponent {}
