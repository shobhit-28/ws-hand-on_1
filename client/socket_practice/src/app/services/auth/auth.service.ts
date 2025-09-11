import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ChromeDataTransactionService } from '../chromeDataTransaction/chrome-data-transaction.service';
import { Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from '../notification/notification.service';
import { Subject } from 'rxjs';
import { deletedMessageRecieverType, Messages } from '../../DTO/message.dto';
import { ChatService } from '../chat/chat.service';
import { ProfilePicHandlerService } from '../profilePicHandler/profile-pic-handler.service';
import { NotificationType } from '../../DTO/notifications.dto';
import { NotificationsService } from '../notifications-service/notifications.service';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private socket: Socket | null = null
  private isLoggedInFlag!: boolean
  private messageRevieverSub = new Subject<Messages[0]>();
  public messageReviever$ = this.messageRevieverSub.asObservable()

  private deletedMessageSub = new Subject<deletedMessageRecieverType>();
  public deletedMessageReciever$ = this.deletedMessageSub.asObservable()

  private offer$ = new Subject<{ from: string, sdp: RTCSessionDescriptionInit }>()
  private answer$ = new Subject<{ from: string, sdp: RTCSessionDescriptionInit }>()
  private ice$ = new Subject<{ from: string, candidate: RTCIceCandidateInit }>()
  private hangup$ = new Subject<string>()
  private busy$ = new Subject<void>()
  private participants$ = new Subject<number>()
  private join$ = new Subject<string>()

  public onOffer$ = this.offer$.asObservable();
  public onAnswer$ = this.answer$.asObservable();
  public onIce$ = this.ice$.asObservable();
  public onHangup$ = this.hangup$.asObservable();
  public onBusy$ = this.busy$.asObservable();
  public onParticipants$ = this.participants$.asObservable();
  public onJoin$ = this.join$.asObservable()

  constructor(
    private chromeDataTransactionService: ChromeDataTransactionService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private data: ChromeDataTransactionService,
    private ns: NotificationService,
    private chatService: ChatService,
    private profilePicHandler: ProfilePicHandlerService,
    private notificationService: NotificationsService
  ) { }

  initSocket(userId: string) {
    try {
      if (isPlatformBrowser(this.platformId) && !this.socket) {
        this.socket = io(environment.signalingUrl, {
          query: { userId },
          transports: ["websocket"]
        });

        this.socket.on('connect', () => {
          console.log('✅ Connected to WebSocket');
          this.socket?.emit('join', userId);
        });

        this.socket.on('receive-message', (msg: Messages[0]) => {
          this.ns.sendBrowserNotification(msg.sender.name, msg.content, true)
          this.messageRevieverSub.next(msg)
        });

        this.socket.on('delete-message', (deletedMsg: deletedMessageRecieverType) => {
          this.deletedMessageSub.next(deletedMsg)
        });

        this.socket.on('profile-pic-changed', (changedBool: true) => {
          this.profilePicHandler.updateLatestProfilePic();
        });

        this.socket.on('profile-user-changed', (changedBool: true) => {
          this.profilePicHandler.updateLatestProfileDetails();
        });

        this.socket.on('remove-notification', (notification: NotificationType) => {
          this.notificationService.removeNotification(notification)
        })

        this.socket.on('add-notification', (notification: NotificationType) => {
          this.notificationService.addNewNotification(notification)
        })

        this.socket.on("call:offer", ({ from, sdp }) => {
          console.log("📞 Offer from", from, sdp);
          this.offer$.next({ from, sdp })
        });

        this.socket.on("call:answer", ({ from, sdp }) => {
          console.log("✅ Answer from", from, sdp);
          this.answer$.next({ from, sdp })
        });

        this.socket.on("ice-candidate", ({ from, candidate }) => {
          console.log("❄️ Candidate from", from, candidate);
          this.ice$.next({ from, candidate })
        });

        this.socket.on("hangup", ({ from }) => {
          console.log("🛑 Hangup from", from);
          this.hangup$.next(from)
        });

        this.socket.on('busy', () => {
          this.busy$.next()
        })

        this.socket.on('incoming-call', ({ from, roomId, callerName }) => {
          console.log('Call hai ji', { from, roomId, callerName })
          const accept = confirm(`Incoming call from ${callerName}. Accept?`);
          console.log(accept)
          if (accept) {
            console.log(`accepted`)
            const userId = this.data.getCookies('user')?.id;
            const url = `${window.location.origin}/call?roomId=${roomId}&userId=${userId}&to=${from}`;
            console.log(url)
            window.open(url, 'video-call', 'width=1000,height=700,noreferrer')
          }
        });

        this.socket.on('user-joined', ({ userId }) => {
          console.log('👥 user-joined for', userId);
          this.join$.next(userId)
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
        this.notificationService.getNotification()
      }
    } else {
      if (isNav) {
        this.router.navigateByUrl('/auth')
      }
      this.chatService.clearSelection()
      this.chromeDataTransactionService.clearAllCookies()
      this.disconnectSocket()
    }
  }

  public isLoggedIn = () => this.isLoggedInFlag

  join(roomId: string, userId: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket?.emit('join', { roomId, userId })
    }
  }

  sendOffer(roomId: string, sdp: RTCSessionDescriptionInit) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket?.emit('call:offer', { roomId, sdp })
    }
  }

  sendAnswer(roomId: string, sdp: RTCSessionDescriptionInit) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket?.emit('call:answer', { roomId, sdp })
    }
  }

  sendIceCandidate(roomId: string, candidate: RTCIceCandidateInit) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket?.emit('ice-candidate', { roomId, candidate })
    }
  }

  sendHangup(roomId: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket?.emit('hangup', { roomId })
    }
  }

  initiateCall(toUserId: string, roomId: string, callerName: string) {
    this.socket?.emit('initiate-call', { toUserId, roomId, callerName });
  }
}
