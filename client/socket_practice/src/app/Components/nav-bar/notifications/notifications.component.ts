import { Component, Input, OnInit } from '@angular/core';
import { NotificationType } from '../../../DTO/notifications.dto';
import { NotificationsService } from '../../../services/notifications-service/notifications.service';

@Component({
  selector: 'raj-chat-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  @Input() notifications!: Array<NotificationType>

  constructor(
    private notificationsService: NotificationsService
  ) { }

  getNotifications = (): Array<NotificationType> => this.notificationsService.getNotifications()
}
