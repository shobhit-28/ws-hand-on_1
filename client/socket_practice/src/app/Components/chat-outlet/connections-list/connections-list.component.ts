import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ChatFriendsList } from '../../../DTO/users.dto';
import { IndividualConnectionComponent } from "./individual-connection/individual-connection.component";
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat/chat.service';

@Component({
  selector: 'raj-chat-connections-list',
  standalone: true,
  imports: [
    IndividualConnectionComponent,
    FormsModule
  ],
  templateUrl: './connections-list.component.html',
  styleUrl: './connections-list.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsListComponent {
  @Input() usersList!: Array<ChatFriendsList>

  connectionFilter: string = ''

  private chatService = inject(ChatService)

  public filterConnections(users: Array<ChatFriendsList>): Array<ChatFriendsList> {
    if (this.connectionFilter === null || this.connectionFilter === '' || this.connectionFilter === undefined) {
      return users
    } else {
      return users.filter(
        (user) => {
          const filter = this.connectionFilter.toLowerCase()
          return (
            user.name.toLocaleLowerCase().includes(filter) ||
            user.email.toLocaleLowerCase().includes(filter)
          )
        }
      )
    }
  }

  public selectUser(user: ChatFriendsList) {
    if (this.getSelectedUser()._id !== user._id) {
      this.chatService.setSelectedChat(user)
    }
  }

  public getSelectedUser = (): ChatFriendsList => this.chatService.getSelectedChat()
}
