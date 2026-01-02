import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeDogListComponent } from './components/home-dog-list/home-dog-list.component';
import { HomeCompletedWalkListComponent } from './components/home-completed-walk-list/home-completed-walk-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [HomeDogListComponent, HomeCompletedWalkListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {}
