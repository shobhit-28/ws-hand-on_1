import { Component, Input } from '@angular/core';
import { UserDetails } from '../../DTO/users.dto';
import { ConnectionsListComponent } from "./connections-list/connections-list.component";
import { RouterOutlet } from '@angular/router';
import { EmptyChatComponent } from './chatInterface/empty-chat/empty-chat.component';
import { ChatCompComponent } from './chatInterface/chat-comp/chat-comp.component';

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

  selectedUser: UserDetails | null = null

  userIdEmitted(user: UserDetails) {
    this.selectedUser = user
  }
}
