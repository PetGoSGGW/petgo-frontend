import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable()
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public signUp(body: { email: string; password: string; birth: string }): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/sign-up`, body);
  }
}
