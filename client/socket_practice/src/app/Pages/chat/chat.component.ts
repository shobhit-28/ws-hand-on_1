import { Component } from '@angular/core';
import { ChatOutletComponent } from "../../Components/chat-outlet/chat-outlet.component";
import { usersList } from '../../DTO/users.dto';

@Component({
  selector: 'raj-chat-chat',
  standalone: true,
  imports: [ChatOutletComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  usersList = usersList
}
