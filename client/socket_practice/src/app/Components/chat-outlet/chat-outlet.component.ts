import { ChangeDetectorRef, Component, inject, Input, ViewChild } from '@angular/core';
import { UserDetails, usersList } from '../../DTO/users.dto';
import { ConnectionsListComponent } from "./connections-list/connections-list.component";
import { EmptyChatComponent } from './chatInterface/empty-chat/empty-chat.component';
import { ChatCompComponent } from './chatInterface/chat-comp/chat-comp.component';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'raj-chat-chat-outlet',
  standalone: true,
  imports: [
    ConnectionsListComponent,
    EmptyChatComponent,
    ChatCompComponent
  ],
  templateUrl: './chat-outlet.component.html',
  styleUrl: './chat-outlet.component.css'
})
export class ChatOutletComponent {
  @Input() usersList: Array<UserDetails> = new Array;
  
  @ViewChild(ConnectionsListComponent) ConnectionListComp !: ConnectionsListComponent

  private chatService = inject(ChatService)

  getAllChatMates = (): Array<UserDetails> => this.chatService.getAllChattingMates()

  getSelectedUser = (): UserDetails => this.chatService.getSelectedChat()
}
