import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, viewChild } from '@angular/core';
import { ChatFriendsList } from '../../../../DTO/users.dto';
import { MatIcon } from '@angular/material/icon';
import { ChatComponent } from "../../../../Pages/chat/chat.component";
import { ChatTextComponent, deletEmitterType } from "./chat-text/chat-text.component";
import { FormsModule, NgForm } from '@angular/forms';
import { ChatService } from '../../../../services/chat/chat.service';
import { CoreJsService } from '../../../../services/coreJs/core-js.service';
import { deletedMessageRecieverType, Messages } from '../../../../DTO/message.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../services/auth/auth.service';
import { ChromeDataTransactionService } from '../../../../services/chromeDataTransaction/chrome-data-transaction.service';
import { CallServiceService } from '../../../../services/call-service/call-service.service';

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
  @Output() messageSentTo: EventEmitter<string> = new EventEmitter<string>();

  chatArr: Messages = new Array();
  message: string | null = null

  constructor(
    private chatService: ChatService,
    private coreJsService: CoreJsService,
    private authService: AuthService,
    private data: ChromeDataTransactionService,
    private callService: CallServiceService
  ) { }

  ngOnInit(): void {
    this.chatService.getMessagesForUser(this.chatService.getSelectedChat()._id).subscribe({
      next: (res) => this.chatArr = res,
      error: (err) => console.error(err)
    })
    this.authService.messageReviever$.subscribe({
      next: (res: Messages[0]) => {
        if (this.chatService.getSelectedChat()._id === res.sender._id) {
          this.chatArr = [...this.chatArr, res]
        }
      }, error: (err) => console.error(err)
    })
    this.authService.deletedMessageReciever$.subscribe({
      next: (res: deletedMessageRecieverType) => {
        if (this.chatService.getSelectedChat()._id === res.userId) {
          this.chatArr = this.chatArr.filter((msg) => msg._id !== res.messageId)
        }
      }, error: (err) => console.error(err)
    })
  }

  back() {
    this.chatService.clearSelection()
  }

  sendMessage(chatForm: NgForm, userId: string) {
    this.chatService.sendMessage(chatForm.value.Chat, userId).subscribe({
      next: (res) => {
        this.messageSentTo.emit(userId)
        this.chatArr = [...this.chatArr, res]
        chatForm.reset()
      }, error: (err: HttpErrorResponse) => console.error(err)
    })
  }

  resizeImg = (url: string) => this.coreJsService.imgResizer(url, 300, 300)

  deleteMessage(msgid: deletEmitterType) {
    this.chatService.deleteMessage(msgid.messageId, msgid.deleteFor).subscribe({
      next: () => {
        this.chatArr = this.chatArr.filter((msg) => msg._id !== msgid.messageId)
      }, error: (err) => console.error(err)
    })
  }

  navigateToUserProfile() {
    this.coreJsService.navigateToProfilePage(this.chatService.getSelectedChat()._id)
  }

  startVideoCall() {
    const userId: string = this.data.getCookies('user').id
    const toUserId: string = this.user._id
    const url = `${window.location.origin}/call?roomId=${this.callService.generateRoomId(userId, toUserId)}&userId=${userId}&to=${toUserId}`
    window.open(url, 'video-call', 'width=1000,height=700,noreferrer')
  }
}
