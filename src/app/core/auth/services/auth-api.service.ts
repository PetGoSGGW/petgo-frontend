import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable()
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public signUp(body: { email: string; password: string; birth: string }) {
    return this.http.post(`${this.apiUrl}/sign-up`, body);
  }

  public logIn(body: { email: string; password: string }) {
    
    return this.http.post(`${this.apiUrl}/log-in`, body);
  }

}