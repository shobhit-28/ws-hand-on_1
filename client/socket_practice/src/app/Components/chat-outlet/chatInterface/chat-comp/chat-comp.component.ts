import { Component, Input } from '@angular/core';
import { UserDetails } from '../../../../DTO/users.dto';

@Component({
  selector: 'raj-chat-chat-comp',
  standalone: true,
  imports: [],
  templateUrl: './chat-comp.component.html',
  styleUrl: './chat-comp.component.css'
})
export class ChatCompComponent {
  @Input() user!: UserDetails
}
