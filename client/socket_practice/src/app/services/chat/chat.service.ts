import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { defaultUserDetail, UserDetails, usersList } from '../../DTO/users.dto';
import { ChatArr, chatArr } from '../../DTO/message.dto';
import { io, Socket } from 'socket.io-client'
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private selectedChat: UserDetails = defaultUserDetail
  private socket: Socket | null = null

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notificationService: NotificationService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket = io('http://localhost:5000');

      this.socket.on('connect', () => {
        console.log('✅ Connected to WebSocket');
      });

      this.socket.on('message', (msg) => {
        console.log('📨 Message from server:', msg);
      });
    }
  }

  getAllChattingMates = (): Array<UserDetails> => usersList

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

  onMessage(): Observable<any> {
    return new Observable((observer) => {
      if (this.socket) {
        this.socket.on('receive-message', (msg: any) => {
          this.notificationService.sendBrowserNotification(`Notification from ${msg.userId}`, msg.Chat, true)
          observer.next(msg)
        })
      }
    })
  }
}
