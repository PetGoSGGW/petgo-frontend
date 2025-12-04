import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileMenuComponent, RouterLink, MatIcon, MatIconButton, MatTooltip],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  protected email = this.authService.email;

  constructor() {
    effect(() => console.log(this.email()));
  }

  protected logout(): void {
    this.authService.logout();
    this.snackBar.open('Zostałeś wylogowany');
  }
}
