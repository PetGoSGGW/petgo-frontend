import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public initPayment$(body: {
    reservationId: number;
  }): Observable<{ sessionId: string; paymentUrl: string }> {
    return this.http.post<{ sessionId: string; paymentUrl: string }>(
      `${this.apiUrl}/payments/init`,
      body,
    );
  }
}
