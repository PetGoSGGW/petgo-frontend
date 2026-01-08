import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [CommonModule, MatCardModule, MatButtonModule],
})
export class NotificationsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationsService = inject(NotificationsService);
  protected readonly notifications = signal<Notification[]>([]);

  protected toggleExpand(notification: Notification): void {
    notification.expanded = !notification.expanded;
  }

  public ngOnInit(): void {
    this.loadNotifications();
  }

  protected loadNotifications(): void {
    this.notificationsService
      .getNotifications()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (notification) => {
          this.notifications.update((list) => [...list, notification]);
        },
        error: (err) => console.error('SSE error', err),
      });
  }

  protected deleteNotification(notification: Notification): void {
    this.notifications.update((list) => list.filter((n) => n !== notification));
  }

  protected clearAll(): void {
    this.notifications.set([]);
  }
}
