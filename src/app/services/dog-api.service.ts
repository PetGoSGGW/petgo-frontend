import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable, of } from 'rxjs';
import { Dog } from '../models/dog.model';
import { sampleDogs } from '../data/sample-data';

@Injectable({
  providedIn: 'root',
})
export class DogApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getDogs$(): Observable<Dog[]> {
    return of(sampleDogs);
  }

  public getDogsByUserId(ownerId: number | string): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.apiUrl}/dogs`, {
      params: { ownerId },
    });
  }
}
