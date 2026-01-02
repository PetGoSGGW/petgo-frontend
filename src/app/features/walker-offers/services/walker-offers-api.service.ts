import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { WalkerOffer } from '../models/walker-offer.model';
import { environment } from '../../../../environments/environment.development';
import { AvailableSlot } from '../models/available-slor.model';
import { Dog } from '../../../models/dog.model';

@Injectable()
export class WalkerOffersApiService {
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

  public getAvailableSlots(offerId: WalkerOffer['id']): Observable<AvailableSlot[]> {
    const availableSlots: AvailableSlot[] = [
      {
        slotId: 1,
        startTime: '2024-06-01T08:00:00Z',
        endTime: '2024-06-01T09:00:00Z',
        latitude: 40.7128,
        longitude: -74.006,
        isReserved: false,
      },
      {
        slotId: 2,
        startTime: '2024-06-01T09:00:00Z',
        endTime: '2024-06-01T10:00:00Z',
        latitude: 34.0522,
        longitude: -118.2437,
        isReserved: true,
      },
      {
        slotId: 3,
        startTime: '2024-06-01T10:00:00Z',
        endTime: '2024-06-01T11:00:00Z',
        latitude: 51.5074,
        longitude: -0.1278,
        isReserved: false,
      },
      {
        slotId: 4,
        startTime: '2024-06-01T11:00:00Z',
        endTime: '2024-06-01T12:00:00Z',
        latitude: 48.8566,
        longitude: 2.3522,
        isReserved: false,
      },
      {
        slotId: 5,
        startTime: '2024-06-01T12:00:00Z',
        endTime: '2024-06-01T13:00:00Z',
        latitude: 35.6895,
        longitude: 139.6917,
        isReserved: false,
      },
      {
        slotId: 6,
        startTime: '2024-06-01T13:00:00Z',
        endTime: '2024-06-01T14:00:00Z',
        latitude: -33.8688,
        longitude: 151.2093,
        isReserved: false,
      },
      {
        slotId: 7,
        startTime: '2024-06-01T14:00:00Z',
        endTime: '2024-06-01T15:00:00Z',
        latitude: 55.7558,
        longitude: 37.6173,
        isReserved: false,
      },
      {
        slotId: 8,
        startTime: '2024-06-01T15:00:00Z',
        endTime: '2024-06-01T16:00:00Z',
        latitude: 41.9028,
        longitude: 12.4964,
        isReserved: true,
      },
    ];

    console.log(offerId);

    return of(availableSlots);
  }

  public reserve(body: {
    offerId: WalkerOffer['id'];
    dogId: Dog['dogId'];
    availablilitySlots: AvailableSlot['slotId'][];
  }): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/reservations/`, body);
  }
}
