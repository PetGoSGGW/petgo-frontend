import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

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
  }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, body);
  }
}
