import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, viewChild } from '@angular/core';
import { ChatFriendsList } from '../../../../DTO/users.dto';
import { MatIcon } from '@angular/material/icon';
import { ChatComponent } from "../../../../Pages/chat/chat.component";
import { ChatTextComponent } from "./chat-text/chat-text.component";
import { FormsModule, NgForm } from '@angular/forms';
import { ChatService } from '../../../../services/chat/chat.service';
import { CoreJsService } from '../../../../services/coreJs/core-js.service';
import { Messages } from '../../../../DTO/message.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'raj-chat-chat-comp',
  standalone: true,
  imports: [
    MatIcon,
    ChatTextComponent,
    FormsModule
  ],
  templateUrl: './chat-comp.component.html',
  styleUrl: './chat-comp.component.css'
})
export class ChatCompComponent implements OnInit {
  @Input() user!: ChatFriendsList

  chatArr: Messages = new Array();
  message: string | null = null

  constructor(
    private chatService: ChatService,
    private coreJsService: CoreJsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.chatService.getM(this.chatService.getSelectedChat()._id).subscribe({
      next: (res) => this.chatArr = res,
      error: (err) => console.error(err)
    })
    this.authService.messageReviever$.subscribe({
      next: (res: Messages[0]) => {
        this.chatArr = [...this.chatArr, res]
      }, error: (err) => console.error(err)
    })
  }

  back() {
    this.chatService.clearSelection()
  }

  sendMessage(chatForm: NgForm, userId: string) {
    this.chatService.sendMessage(chatForm.value.Chat, userId).subscribe({
      next: (res) => {
        this.chatArr = [...this.chatArr, res]
        chatForm.reset()
      }, error: (err: HttpErrorResponse) => console.error(err)
    })
  }

  getMessages(userId: string) {
    return this.chatService.getMessagesForUser(userId)
  }

  resizeImg = (url: string) => this.coreJsService.imgResizer(url, 300, 300)
}
