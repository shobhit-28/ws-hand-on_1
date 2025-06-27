import { Component, Input } from '@angular/core';
import { UserDetails } from '../../DTO/users.dto';

@Component({
  selector: 'raj-chat-chat-outlet',
  standalone: true,
  imports: [],
  templateUrl: './chat-outlet.component.html',
  styleUrl: './chat-outlet.component.css'
})
export class ChatOutletComponent {
  @Input() usersList: Array<UserDetails> = new Array;
}
