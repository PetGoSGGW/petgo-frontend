import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from './notification';
import { environment } from '../../environments/environment.development';
import { NotificationEventName } from './notification-event-name';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly apiUrl = environment.apiUrl;
  private eventSource: EventSource = new EventSource(`${this.apiUrl}/notifications/stream`);
  private notificationId = 1;

  public getNotifications(): Observable<Notification> {
    return new Observable((observer) => {
      Object.values(NotificationEventName).forEach((eventName) => {
        this.eventSource.addEventListener(eventName, (e: MessageEvent) => {
          observer.next({ id: this.notificationId++, title: eventName, content: e.data });
        });
      });
    });
  }
}
