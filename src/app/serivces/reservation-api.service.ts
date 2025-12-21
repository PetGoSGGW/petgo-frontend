import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable()
export class ReservationApiService {
  public getReservations$(): Observable<Reservation[]> {
    return of([] as Reservation[]);
  }
}
