import { ChangeDetectorRef, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { defaultChatFriendVal, ChatFriendsList } from '../../DTO/users.dto';
import { ConnectionsListComponent } from "./connections-list/connections-list.component";
import { EmptyChatComponent } from './chatInterface/empty-chat/empty-chat.component';
import { ChatCompComponent } from './chatInterface/chat-comp/chat-comp.component';
import { ChatService } from '../../services/chat/chat.service';
import { AuthService } from '../../services/auth/auth.service';
import { CoreJsService } from '../../services/coreJs/core-js.service';

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
export class ChatOutletComponent implements OnInit {
  @Input() usersList: Array<ChatFriendsList> = new Array;

  @ViewChild(ConnectionsListComponent) ConnectionListComp !: ConnectionsListComponent

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private coreJsService: CoreJsService
  ) { }

  chattingUserList: Array<ChatFriendsList> = new Array();

  ngOnInit(): void {
    this.authService.messageReviever$.subscribe({
      next: (res) => {
        this.usersList = this.coreJsService.moveToTop(this.usersList, res.sender._id)
      }, error: (err) => console.error(err)
    })
  }

  // getAllChatMates = (): Array<ChatFriendsList> => this.chatService.getAllChattingMates()

  getSelectedUser = (): ChatFriendsList => this.chatService.getSelectedChat()

  messageSentTo(id: string) {
    this.usersList = this.coreJsService.moveToTop(this.usersList, id)
  }
}
