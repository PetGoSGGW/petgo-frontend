import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Dog } from '../models/dog.model';

@Injectable({
  providedIn: 'root',
})
export class DogApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getDogsByUserId(ownerId: number | string): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.apiUrl}/dogs`, {
      params: { ownerId },
    });
  }
}
