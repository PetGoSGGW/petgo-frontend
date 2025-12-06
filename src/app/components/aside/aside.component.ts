import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationListComponent } from '../navigation-list/navigation-list.component';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavigationListComponent],
})
export class AsideComponent {}
