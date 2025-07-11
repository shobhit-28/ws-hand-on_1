import { Component, inject, OnInit } from '@angular/core';
import { ChatOutletComponent } from "../../Components/chat-outlet/chat-outlet.component";
import { defaultChatFriendVal, ChatFriendsList } from '../../DTO/users.dto';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'raj-chat-chat',
  standalone: true,
  imports: [ChatOutletComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  private chatService = inject(ChatService)

  ngOnInit(): void {
    this.chatService.getChattableMates()
  }

  getAllMates = (): Array<ChatFriendsList> => this.chatService.getAllChattingMates()
}
