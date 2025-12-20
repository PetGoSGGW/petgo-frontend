import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Dog } from '../models/dog.model';

@Injectable()
export class DogApiService {
  private readonly http = inject(HttpClient);
  private readonly urlApi = environment.apiUrl;

  public getDogs$(userId: number): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.urlApi}/dogs`, { params: { userId } });
  }
}
