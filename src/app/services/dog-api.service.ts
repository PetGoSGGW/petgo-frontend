import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Dog } from '../models/dog.model';
import { Breed } from '../models/breed.model';

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

  public getDog$(id: number): Observable<Dog> {
    return this.http.get<Dog>(`${this.apiUrl}/dogs/${id}`);
  }

  public updateDog$(
    id: number,
    request: {
      breedCode: number;
      name: string;
      size: string;
      notes: string;
      weightKg: number;
      isActive: boolean;
    },
  ): Observable<Dog> {
    return this.http.patch<Dog>(`${this.apiUrl}/dogs/${id}`, request);
  }

  public getDogs$(): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.apiUrl}/dogs`);
  }

  public addDog$(body: {
    breedCode: Breed['breedCode'];
    name: string;
    size: string;
    notes: string;
    weightKg: number;
  }): Observable<Dog> {
    return this.http.post<Dog>(`${this.apiUrl}/dogs`, body);
  }

  public getBreeds$(): Observable<Breed[]> {
    return this.http.get<Breed[]>(`${this.apiUrl}/dogs/breeds`);
  }
}
