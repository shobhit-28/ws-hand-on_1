import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ChromeDataTransactionService } from '../chromeDataTransaction/chrome-data-transaction.service';
import { Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from '../notification/notification.service';
import { Subject } from 'rxjs';
import { Messages } from '../../DTO/message.dto';
import { ChatService } from '../chat/chat.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private socket: Socket | null = null
  private isLoggedInFlag!: boolean
  private messageRevieverSub = new Subject<Messages[0]>();
  public messageReviever$ = this.messageRevieverSub.asObservable()

  constructor(
    private chromeDataTransactionService: ChromeDataTransactionService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private data: ChromeDataTransactionService,
    private ns: NotificationService,
    private chatService: ChatService
  ) { }

  initSocket(userId: string) {
    try {
      if (isPlatformBrowser(this.platformId) && !this.socket) {
        this.socket = io('http://localhost:5000', {
          query: { userId }
        });

        this.socket.on('connect', () => {
          console.log('✅ Connected to WebSocket');
          this.socket?.emit('join', userId);
        });

        this.socket.on('receive-message', (msg: Messages[0]) => {
          this.ns.sendBrowserNotification(msg.sender.name, msg.content, true)
          if (this.chatService.getSelectedChat()._id === msg.sender._id) {
            this.messageRevieverSub.next(msg)
          }
        });

        this.socket.on('message:deleted', (messageId) => {
          console.log('🗑️ Message deleted:', messageId);
        });

        this.socket.on('got-followed', (follower) => {
          console.log('You got followed', follower);
        });

        this.socket.on('disconnect', () => {
          console.log('❌ Disconnected from WebSocket');
        });
      }
    } catch (error) {
      console.error(error)
    }
  }

  disconnectSocket() {
    this.socket?.disconnect();
    this.socket = null;
  }

  setIsLoggedIn(flag: boolean, isNav?: boolean) {
    this.isLoggedInFlag = flag;
    const userId = this.data.getCookies('user')?.id
    if (flag) {
      if (isNav && userId) {
        this.router.navigateByUrl('')
      }
      if (userId) {
        this.initSocket(userId)
      }
    } else {
      if (isNav) {
        this.router.navigateByUrl('/auth')
      }
      this.chromeDataTransactionService.clearAllCookies()
      this.disconnectSocket()
    }
  }

  public isLoggedIn = () => this.isLoggedInFlag
}
