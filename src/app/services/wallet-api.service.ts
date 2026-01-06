import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';
import { Observable } from 'rxjs';
import { Wallet } from '../models/wallet.model';

@Injectable()
export class WalletApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getTransactions$(id: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/wallet/${id}/transactions`);
  }

  public getWallet$(id: number): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.apiUrl}/wallet/${id}`);
  }
}
