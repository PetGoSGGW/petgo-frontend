import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from './notification';
import { environment } from '../../environments/environment.development';
import { SseClient } from 'ngx-sse-client';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../core/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly apiUrl = environment.apiUrl;
  private sseClient = inject(SseClient);
  private authService = inject(AuthService);

  public getNotifications(): Observable<Notification> {
    return new Observable((observer) => {
      const headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.authService.accessToken()}`,
      );

      this.sseClient
        .stream(
          `${this.apiUrl}/notifications/stream`,
          { keepAlive: true, reconnectionDelay: 1000, responseType: 'event' },
          { headers },
          'GET',
        )
        .subscribe((event) => {
          if (event.type === 'error') {
            const errorEvent = event as ErrorEvent;
            console.error(errorEvent.error, errorEvent.message);
          } else {
            const messageEvent = event as MessageEvent;
            observer.next({
              title: messageEvent.type,
              content: messageEvent.data,
            });
          }
        });
    });
  }
}
