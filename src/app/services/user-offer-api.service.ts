import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { WalkerOffer } from '../features/walker-offers/models/walker-offer.model';

@Injectable()
export class UserOfferApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getUserOffer$(): Observable<WalkerOffer> {
    return this.http.get<WalkerOffer>(`${this.apiUrl}/offers/my`);
  }
}
