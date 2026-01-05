import { Injectable } from '@angular/core';
import { concat, map, Observable, of, scan, timer } from 'rxjs';

@Injectable()
export class WalkApiService {
  // private readonly http = inject(HttpClient);
  // private readonly apiUrl = environment.apiUrl;

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

    return concat(of(initialPath), timer(5000, 3000).pipe(map(() => null))).pipe(
      scan(
        (currentPath, trigger) => {
          if (Array.isArray(trigger)) {
            return trigger;
          }

          const lastPoint = currentPath[currentPath.length - 1];
          const newPoint = {
            latitude: lastPoint.latitude + 0.00005,
            longitude: lastPoint.longitude + 0.00005,
          };

          return [...currentPath, newPoint];
        },
        [] as { latitude: number; longitude: number }[],
      ),
    );
  }
}
