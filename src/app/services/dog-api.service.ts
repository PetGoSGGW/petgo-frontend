import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Dog } from '../models/dog.model';

export interface DogUpdateRequestDto {
  breedCode: string | null;
  name: string;
  size: string | null;
  notes: string | null;
  weightKg: number | null;
  isActive: boolean | null;
}

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

  public getDog(id: number | string): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.apiUrl}/dogs/${id}`);
  }

  public updateDog(id: number | string, request: DogUpdateRequestDto): Observable<Dog> {
    return this.http.patch<Dog>(`${this.apiUrl}/dogs/${id}`, {
      params: request
    });
  }
}
