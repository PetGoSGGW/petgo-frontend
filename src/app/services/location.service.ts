import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  public getCurrentLocation$(): Observable<GeolocationCoordinates> {
    return new Observable((observer) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            try {
              observer.next(position.coords);
              observer.complete();
            } catch (error) {
              observer.error(error);
            }
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert('User denied the request for Geolocation.');
                break;
              case error.POSITION_UNAVAILABLE:
                alert('Location information is unavailable.');
                break;
              case error.TIMEOUT:
                alert('The request to get user location timed out.');
                break;
            }

            observer.error(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );
      } else {
        observer.error('Geolocation is not available in this browser.');
      }
    });
  }
}
