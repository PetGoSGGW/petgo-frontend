import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { AvailableSlot } from '../../walker-offers/models/available-slot.model';

@Injectable()
export class UserWalkerOfferDetailsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public updateOffer$(body: {
    priceCents: number;
    description: string;
    isActive: boolean;
  }): Observable<unknown> {
    return this.http.patch<unknown>(`${this.apiUrl}/offers/my`, body);
  }

  public removeSlot$(slotId: AvailableSlot['slotId']): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiUrl}/slots/${slotId}`);
  }

  public addSlot$(
    body: {
      startTime: string;
      endTime: string;
      latitude: number;
      longitude: number;
    }[],
  ): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/slots`, body);
  }
}
