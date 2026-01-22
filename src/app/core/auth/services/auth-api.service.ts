import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Session } from '../models/session.model';

@Injectable()
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public register(body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    dateOfBirth: string;
  }): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/auth/register`, body);
  }

  public login(body: { email: string; password: string }): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/auth/login`, body);
  }
}
