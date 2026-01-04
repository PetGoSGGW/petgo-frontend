import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WalkerReservation } from '../models/walker-reservation.model';
import { sampleWalkerReservations } from '../data/sample-walker-reservations';

@Injectable()
export class WalkerReservationsApiService {
    public getWalkerReservations$(walkerId: number): Observable<WalkerReservation[]> {
        // TODO: Replace with actual API call
        // return this.http.get<WalkerReservation[]>(`${environment.apiUrl}/walkers/${walkerId}/reservations`);

        // For now, return sample data
        return of(sampleWalkerReservations);
    }
}
