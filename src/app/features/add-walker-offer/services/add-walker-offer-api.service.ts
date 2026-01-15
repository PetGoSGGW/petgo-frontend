import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AddWalkerOfferApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public addOffer$(body: { priceCents: number; description: string }): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/offers`, body);
  }

  public addSlots$(
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
