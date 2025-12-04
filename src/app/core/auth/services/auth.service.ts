import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../models/session.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private readonly _session = signal<Session | null>(null);
  private readonly _localStorageKey = signal({
    session: 'session',
  }).asReadonly();

  public session = this._session.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.session());
  public readonly email = computed(() => this.session()?.email);
  public readonly accessToken = computed(() => this.session()?.accessToken);
  public readonly tokenType = computed(() => this.session()?.tokenType);

  public loadSession(): void {
    const session = localStorage.getItem(this._localStorageKey().session);

    if (session) {
      console.log(JSON.parse(session));
      this._session.set(JSON.parse(session));
    }
  }

  public saveSession(session: Session): void {
    localStorage.setItem(this._localStorageKey().session, JSON.stringify(session));
    this._session.set(session);
  }

  public async logout(): Promise<void> {
    this._session.set(null);

    localStorage.removeItem(this._localStorageKey().session);

    await this.router.navigate(['/autoryzacja/logowanie']);
  }
}
