import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserApiService } from '../../services/user-api.service';
import { User } from '../../models/user.model';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRipple,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  private readonly userApiService = inject(UserApiService);
  public readonly searchQuery = signal<string>('');
  protected readonly users = rxResource({
    stream: () => this.userApiService.getUsers(),
  });
  public readonly filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const users = this.users.hasValue() ? this.users.value() : [];

    if (!query) {
      return users;
    }

    return users.filter(
      (user: { firstName: string; lastName: string; username: string }) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query),
    );
  });

  public onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
  public getAvatarUrl(user: User): string {
    return `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff&size=100`;
  }
}
