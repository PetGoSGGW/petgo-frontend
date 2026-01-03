import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { WalkerOffer } from '../models/walker-offer.model';
import { environment } from '../../../../environments/environment.development';
import { AvailableSlot } from '../models/available-slot.model';
import { Dog } from '../../../models/dog.model';

@Injectable()
export class WalkerOffersApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getOffers(params: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  }): Observable<{ content: WalkerOffer[]; totalElements: number; number: number }> {
    console.log(params);
    return this.http.get<{ content: WalkerOffer[]; totalElements: number; number: number }>(
      '/assets/mock/walker-offers-search.json',
    );

    // return this.http.get<{ content: WalkerOffer[]; totalElements: number; number: number }>(
    //   `${this.apiUrl}/offers/search`,
    //   { params },
    // );
  }

  public getAvailableSlots(offerId: WalkerOffer['offerId']): Observable<AvailableSlot[]> {
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
    offerId: WalkerOffer['offerId'];
    dogId: Dog['dogId'];
    availablilitySlots: AvailableSlot['slotId'][];
  }): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/reservations/`, body);
  }
}
