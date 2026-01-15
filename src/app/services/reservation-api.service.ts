import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Dog } from '../models/dog.model';

@Injectable({ providedIn: 'root' })
export class ReservationApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getReservations$(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations`);
  }

  public getDogReservations$(dogId: Dog['dogId']): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/dog/${dogId}/reservations`);
  }

  public confirm$(id: Reservation['reservationId']) {
    return this.http.post(`${this.apiUrl}/reservations/${id}/confirm`, {});
  }

  public cancel$(id: Reservation['reservationId']) {
    return this.http.post(`${this.apiUrl}/reservations/${id}/cancel`, {});
  }
}
