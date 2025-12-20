import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/auth/services/auth.service';
import { DogApiService } from '../../serivces/dog-api.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [MatProgressSpinner, MatButton, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  private readonly authService = inject(AuthService);
  private readonly dogApi = inject(DogApiService);

  protected readonly userId = computed(() => this.authService.session()?.userId);

  constructor() {
    effect(() => console.log(this.userId()));
  }

  protected dogs = rxResource({
    params: () => ({ userId: this.userId() }),
    stream: ({ params: { userId } }) => this.dogApi.getDogs$(userId ?? -1),
  });
}
