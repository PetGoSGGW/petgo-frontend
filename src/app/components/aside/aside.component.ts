import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationListComponent } from '../navigation-list/navigation-list.component';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, NavigationListComponent],
})
export class AsideComponent {}
