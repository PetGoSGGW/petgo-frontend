import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { concat, map, Observable, of, scan, timer } from 'rxjs';

@Injectable()
export class WalkApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public addCoordinatePoint(body: {
    sessionId: number;
    latitude: number;
    longitude: number;
  }): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/gps/point`, body);
  }

  public getWalkRoute$(
    reservationId: number,
  ): Observable<{ latitude: number; longitude: number }[]> {
    console.log(reservationId);
    // return this.http.get<{ latitude: number; logitude: number; recordedAt: string }[]>(
    //   `${this.apiUrl}/gps/route/${reservationId}`,
    // );
    const initialPath = [
      { latitude: 40.785091, longitude: -73.968285 },
      { latitude: 40.78512, longitude: -73.96825 },
      { latitude: 40.785155, longitude: -73.96821 },
      { latitude: 40.7852, longitude: -73.96818 },
      { latitude: 40.785245, longitude: -73.96815 },
      { latitude: 40.7853, longitude: -73.96812 },
      { latitude: 40.78536, longitude: -73.9681 },
      { latitude: 40.78542, longitude: -73.96808 },
    ];

    return concat(
      of(initialPath), // Emit initial data immediately
      timer(5000, 3000).pipe(
        // Wait 5s, then tick every 3s
        map(() => null), // Map ticks to null (just a trigger)
      ),
    ).pipe(
      // 3. Accumulate state using 'scan'
      scan(
        (currentPath, trigger) => {
          // If the trigger is just the initial array (first emission), return it
          if (Array.isArray(trigger)) {
            return trigger;
          }

          // Otherwise, generate a NEW point based on the last known location
          const lastPoint = currentPath[currentPath.length - 1];
          const newPoint = {
            // Move slightly North-East (approx walking speed)
            latitude: lastPoint.latitude + 0.00005,
            longitude: lastPoint.longitude + 0.00005,
          };

          // Return the new array with the added point
          return [...currentPath, newPoint];
        },
        [] as { latitude: number; longitude: number }[],
      ),
    );
  }

  public finishWalk$(sessionId: number): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/gps/stop/${sessionId}`, {});
  }
}
