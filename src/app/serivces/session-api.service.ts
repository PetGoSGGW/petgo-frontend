import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

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

  public finishWalk$(sessionId: number): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/gps/stop/${sessionId}`, {});
  }
}
