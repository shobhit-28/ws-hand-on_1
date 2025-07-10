import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { defaultUserDetail, UserDetails, usersList } from '../../DTO/users.dto';
import { ChatArr, chatArr } from '../../DTO/message.dto';
import { io, Socket } from 'socket.io-client'
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from '../notification/notification.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private selectedChat: UserDetails = defaultUserDetail
  private socket: Socket | null = null

  constructor(
    private notificationService: NotificationService,
    private http: HttpClient
  ) { }

  getAllChattingMates = (): Array<UserDetails> => usersList

  getChattableMates = () => {
    this.http.get(`/rchat/toggle-follow/followers`).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.error(err)
    })
  }

  setSelectedChat(user: UserDetails): void {
    this.selectedChat = defaultUserDetail;
    setTimeout(() => {
      this.selectedChat = user
    }, 100)
  }

  clearSelection = (): void => {
    this.selectedChat = defaultUserDetail
  }

  getSelectedChat = (): UserDetails => this.selectedChat

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
