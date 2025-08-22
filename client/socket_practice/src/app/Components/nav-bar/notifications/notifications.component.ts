import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationType } from '../../../DTO/notifications.dto';
import { NotificationsService } from '../../../services/notifications-service/notifications.service';
import { RouterModule } from '@angular/router';
import { CoreJsService } from '../../../services/coreJs/core-js.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'raj-chat-notifications',
  standalone: true,
  imports: [
    RouterModule,
    MatTooltipModule,
    MatIconModule
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  @Input() notifications!: Array<NotificationType>
  @Output() notificationCloserEmitter: EventEmitter<void> = new EventEmitter()

  constructor(
    private notificationsService: NotificationsService,
    private coreJsService: CoreJsService
  ) { }

  getNotifications = (): Array<NotificationType> => this.notificationsService.getNotifications()

  navigate(notification: NotificationType) {
    if (notification.type === 'follow') {
      this.coreJsService.navigateToProfilePage(notification.senderId._id)
    }
    this.afterNavigation(notification._id)
  }

  afterNavigation(notificationId: string) {
    this.markAsRead(notificationId)
    this.notificationCloserEmitter.emit()
  }

  truncateText = (txt: string): string => this.coreJsService.truncateText(txt, 30)

  markAsRead(notificationId: string) {
    this.notificationsService.markNotificationAsRead(notificationId)
  }

  deleteNotification(notificationId: string) {
    this.notificationsService.deleteNotification(notificationId)
  }
}
