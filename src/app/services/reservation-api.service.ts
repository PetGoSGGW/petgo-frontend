import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Dog } from '../models/dog.model';

@Injectable()
export class ReservationApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getReservations$(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations`);
  }

  public getDogReservations$(dogId: Dog['dogId']): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/dog/${dogId}/reservations`);
  }

  public cancelReservation$(reservationId: Reservation['reservationId']): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reservations/${reservationId}/cancel`, {});
  }
}
