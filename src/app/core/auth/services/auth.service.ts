import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private _isAuthenticated = signal(false);
  private _user = signal<User | null>(null);

  public isAuthenticated = this._isAuthenticated.asReadonly();
  public user = this._user.asReadonly();

  constructor() {
    const session = localStorage.getItem('session');

    if (session) {
      this._isAuthenticated.set(!!JSON.parse(session));
    }
  }

  public setAuthentication(session: boolean): void {
    this._isAuthenticated.set(session);
    localStorage.setItem('session', JSON.stringify(session));
  }

  public setUser(user: User | null): void {
    this._user.set(user);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  public async logout(): Promise<void> {
    this._isAuthenticated.set(false);
    this._user.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('session');

    await this.router.navigate(['/autoryzacja/logowanie']);
  }

  // TODO: implement saving, getting and removing session from local storage or cookies
}
