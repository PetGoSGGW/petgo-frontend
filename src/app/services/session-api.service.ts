import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SessionApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public addCoordinatePoint$(body: {
    sessionId: number;
    latitude: number;
    longitude: number;
  }): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/gps/point`, body);
  }

  public startWalk$(reservationId: number): Observable<number> {
    return this.http
      .post<{ sessionId: number } | number>(`${this.apiUrl}/gps/start/${reservationId}`, {})
      .pipe(map((response) => (typeof response === 'number' ? response : response.sessionId)));
  }

  public finishWalk$(sessionId: number): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/gps/stop/${sessionId}`, {});
  }
}
