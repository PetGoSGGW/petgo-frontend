import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = signal(false);

  public isAuthenticated = this._isAuthenticated.asReadonly();

  public setAuthentication(session: boolean): void {
    this._isAuthenticated.set(session);
  }

  // TODO: implement saving, getting and removing session from local storage or cookies
}
