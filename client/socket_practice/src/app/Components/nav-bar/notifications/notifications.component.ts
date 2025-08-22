import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationType } from '../../../DTO/notifications.dto';
import { NotificationsService } from '../../../services/notifications-service/notifications.service';
import { RouterModule } from '@angular/router';
import { CoreJsService } from '../../../services/coreJs/core-js.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'raj-chat-notifications',
  standalone: true,
  imports: [
    RouterModule,
    MatTooltipModule,
    MatIconModule,
    CommonModule
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
    } else if (notification.type === 'reply' || notification.type === 'comment' || notification.type === 'like') {
      console.log(notification.postId)
      if (notification.postId) {
        this.coreJsService.navigateToPostPage(notification.postId._id)
      } else {
        console.error('Something went wrong')
      }
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

  markAllAsRead() {
    this.notificationsService.markAllNotificationsAsRead();
  }

  deleteAllNotifications() {
    this.notificationsService.deleteAllNotifications();
  }

  isNewNotifications = () => this.notificationsService.isNewNotification()

  timeAgo = (isoString: string) => this.coreJsService.timeAgo(isoString)
}
