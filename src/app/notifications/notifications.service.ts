import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Notification } from './notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private apiUrl = ''; // placeholder for now

  public getNotifications(): Observable<Notification[]> {
    const mockData: Notification[] = [
      {
        id: 1,
        title: 'Odwołany spacer z psem',
        content:
          'Dzisiejszy spacer z psem o 15:00 został odwołany z powodu złych warunków pogodowych.',
        user: 'Jan Kowalski',
      },
      {
        id: 2,
        title: 'Notification 2',
        content: 'Description.',
        user: 'John Doe',
      },
      {
        id: 3,
        title: 'Notification 3',
        content: 'Description.',
        user: 'John Doe',
      },
    ];

    // return this.http.get<Notification[]>(`${this.apiUrl}`);
    return of(mockData);
  }

  public deleteNotification(id: number): Observable<void> {
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    console.log('Mock delete notification:', id);
    return of(void 0);
  }

  public clearAllNotifications(): Observable<void> {
    // return this.http.delete<void>(this.apiUrl);
    console.log('Mock clear all notifications');
    return of(void 0);
  }
}
