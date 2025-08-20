import { Component, Input } from '@angular/core';
import { NotificationType } from '../../../DTO/notifications.dto';

@Component({
  selector: 'raj-chat-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  @Input() notifications!: Array<NotificationType>
}
