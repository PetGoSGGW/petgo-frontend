import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  private readonly http = inject(HttpClient);
  private apiUrl = ''; // placeholder for now

  public getDogWalkers(): Observable<DogWalker[]> {
    const mockData: DogWalker[] = [
        {
        name: 'Julia',
        username: 'julia',
        rating: 4,
        reviews: 201,
        distance: 0.9,
        rate: 40,
        age: 22,
        city: 'Warszawa',
        street: 'ul. Długa 10',
        postal: '00-886',
        },
        {
        name: 'Kasia',
        username: 'kasia',
        rating: 4,
        reviews: 123,
        distance: 1.2,
        rate: 35,
        age: 26,
        city: 'Warszawa',
        street: 'ul. Długa 5',
        postal: '00-110',
        },
    ];

    // return this.http.get<DogWalker[]>(`${this.apiUrl}`);
    return of(mockData);
  }
}