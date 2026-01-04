import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { sampleReservations } from '../data/sample-data';

@Injectable()
export class ReservationApiService {
  public getReservations$(): Observable<Reservation[]> {
    return of(sampleReservations);
  }
}
