import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WalkerOffer } from '../models/walker-offer.model';
import { environment } from '../../../../environments/environment';
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
    page: number;
  }): Observable<{ content: WalkerOffer[]; totalElements: number; number: number }> {
    return this.http.get<{ content: WalkerOffer[]; totalElements: number; number: number }>(
      `${this.apiUrl}/offers/search`,
      { params: { ...params } },
    );
  }

  public reserve$(body: {
    offerId: WalkerOffer['offerId'];
    dogId: Dog['dogId'];
    availabilitySlotIds: AvailableSlot['slotId'][];
  }): Observable<{ reservationId: number }> {
    return this.http.post<{ reservationId: number }>(`${this.apiUrl}/reservations`, body);
  }

  public getOffer$(id: WalkerOffer['offerId']): Observable<WalkerOffer> {
    return this.http.get<WalkerOffer>(`${this.apiUrl}/reservations/${id}`);
  }
}
