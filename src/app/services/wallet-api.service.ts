import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Wallet } from '../models/wallet.model';

@Injectable({ providedIn: 'root' })
export class WalletApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getTransactions$(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/wallets/me/transactions`).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of([]);
        }
        return throwError(() => error);
      }),
    );
  }

  public getWallet$(): Observable<Wallet | null> {
    return this.http.get<Wallet | null>(`${this.apiUrl}/wallets/me`).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of(null);
        }
        return throwError(() => error);
      }),
    );
  }

  public depositMoney$(
    id: Wallet['walletId'],
    body: { amountCents: number; description: string },
  ): Observable<Wallet> {
    return this.http.post<Wallet>(`${this.apiUrl}/wallets/${id}/topup`, body);
  }

  public withdrawMoney$(
    id: Wallet['walletId'],
    body: { amountCents: number; description: string },
  ): Observable<Wallet> {
    return this.http.post<Wallet>(`${this.apiUrl}/wallets/${id}/payout`, body);
  }
}
