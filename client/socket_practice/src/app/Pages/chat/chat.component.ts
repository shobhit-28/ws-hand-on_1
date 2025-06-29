import { Component, inject } from '@angular/core';
import { ChatOutletComponent } from "../../Components/chat-outlet/chat-outlet.component";
import { UserDetails, usersList } from '../../DTO/users.dto';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'raj-chat-chat',
  standalone: true,
  imports: [ChatOutletComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private chatService = inject(ChatService)

  getAllMates = (): Array<UserDetails> => this.chatService.getAllChattingMates()
}
