import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { WalkerOffer } from '../models/walker-offer.model';
import { environment } from '../../../../environments/environment.development';

@Injectable()
export class WalkerOffersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getOffers(search: string): Observable<WalkerOffer[]> {
    const mockData: WalkerOffer[] = [
      {
        id: 1,
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
        id: 2,
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
    ].filter((walker) => walker.name.toLowerCase().includes(search.toLowerCase()));

    console.log(mockData);

    return of(mockData);
  }
}
