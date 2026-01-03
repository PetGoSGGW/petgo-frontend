import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileMenuComponent, RouterLink, MatIcon, MatIconButton, MatTooltip, MatButton],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  protected email = this.authService.email;
  protected readonly id = computed(() => this.authService.session()?.userId);

  protected logout(): void {
    this.authService.logout();
    this.snackBar.open('Zostałeś wylogowany');
  }
}
