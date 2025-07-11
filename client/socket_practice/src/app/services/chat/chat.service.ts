import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { defaultChatFriendVal, ChatFriendsList } from '../../DTO/users.dto';
import { ChatArr, chatArr } from '../../DTO/message.dto';
import { io, Socket } from 'socket.io-client'
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from '../notification/notification.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../DTO/commonResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private selectedChat: ChatFriendsList = defaultChatFriendVal
  private socket: Socket | null = null
  usersList: Array<ChatFriendsList> = [];

  constructor(
    private notificationService: NotificationService,
    private http: HttpClient
  ) { }

  getAllChattingMates = (): Array<ChatFriendsList> => this.usersList

  getChattableMates = () => {
    this.http.get<ApiResponse<Array<ChatFriendsList>>>(`/rchat/chat/getchatfriendslist`).subscribe({
      next: (res: ApiResponse<Array<ChatFriendsList>>) => {
        this.usersList = res.data
      },
      error: (err) => console.error(err)
    })
  }

  setSelectedChat(user: ChatFriendsList): void {
    this.selectedChat = defaultChatFriendVal;
    setTimeout(() => {
      this.selectedChat = user
    }, 100)
  }

  clearSelection = (): void => {
    this.selectedChat = defaultChatFriendVal
  }

  getSelectedChat = (): ChatFriendsList => this.selectedChat

  getMessagesForUser(userId: string): ChatArr {
    return chatArr
  }

  sendMessage(message: string, userId: string) {
    console.log(message, userId)
    if (this.socket) {
      this.socket.emit('send-message', message, userId)
      this.notificationService.askForBrowserNotificationPermission()
    }
  }
}
