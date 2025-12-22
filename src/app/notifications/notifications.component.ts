import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [CommonModule, MatCardModule, MatButtonModule],
})
export class NotificationsComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);
  protected notifications: Notification[] = [];

  protected toggleExpand(notification: Notification): void {
    notification.expanded = !notification.expanded;
  }

  public ngOnInit(): void {
    this.loadNotifications();
  }

  protected loadNotifications(): void {
    this.notificationsService.getNotifications().subscribe((data) => {
      this.notifications = data;
    });
  }

  protected deleteNotification(id: number): void {
    this.notificationsService.deleteNotification(id).subscribe(() => {
      this.notifications = this.notifications.filter((n) => n.id !== id);
    });
  }

  protected clearAll(): void {
    this.notificationsService.clearAllNotifications().subscribe(() => {
      this.notifications = [];
    });
  }
}
