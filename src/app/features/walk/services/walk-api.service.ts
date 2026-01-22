import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface WalkRoutePoint {
  latitude: number;
  longitude: number;
  recordedAt: string;
}

@Injectable()
export class WalkApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getWalkRoute$(reservationId: number): Observable<WalkRoutePoint[]> {
    return this.http.get<WalkRoutePoint[]>(`${this.apiUrl}/gps/route/${reservationId}`);
  }
}
