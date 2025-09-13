import { Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CallServiceService } from '../../services/call-service/call-service.service';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'raj-chat-call',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './call.component.html',
  styleUrl: './call.component.css'
})
export class CallComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideoRef!: ElementRef<HTMLVideoElement>;

  roomId = '';
  userId = '';
  toUserId = '';
  participants = signal(0);
  micOn = signal(true);
  camOn = signal(true);
  connectionState = signal<string>('disconnected');
  deviceList: MediaDeviceInfo[] = [];
  isPopup: boolean = false;
  user: any = null; // User info for display

  constructor(
    private route: ActivatedRoute,
    private call: CallServiceService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.initCallComponent()
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }

  ngOnDestroy(): void {
    this.cleanup();
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }

  async initCallComponent() {
    try {
      this.isPopup = window.opener !== null || window.name === 'video-call';

      this.roomId = this.route.snapshot.queryParamMap.get('roomId') || '';
      this.userId = this.route.snapshot.queryParamMap.get('userId') || '';
      this.toUserId = this.route.snapshot.queryParamMap.get('to') || '';

      if (this.roomId && this.userId) {
        console.log(`initialized`)
        await this.initializeCall();
        await this.loadAvailableDevices();

        this.monitorConnectionState();
      } else {
        console.error('❌ Missing required parameters');
        this.closeWindow();
      }
      let readyForOffer = false;
      this.authService.onJoin$.subscribe(userId => {
        console.log('👥 user-joined for', userId);

        if (this.call.getIsCaller() && !readyForOffer) {
          readyForOffer = true;
          this.call.startCall(
            this.roomId,
            userId,
            this.localVideoRef.nativeElement,
            this.remoteVideoRef.nativeElement
          );
        }
      })
      this.authService.onHangup$.subscribe(() => {
        console.log('call ended');
        this.closeWindow()
      })
    } catch (error) {
      console.error('❌ Error initializing call component:', error);
    }
  }

  beforeUnloadHandler = () => {
    this.hangup();
  };

  private async initializeCall(): Promise<void> {
    try {
      console.log('🚀 Initializing call...');
      console.log('🔍 Users:', { userId: this.userId, toUserId: this.toUserId });

      setTimeout(async () => {
        // Determine caller vs joiner automatically
        const isCaller = this.userId < this.toUserId; // Deterministic

        if (isCaller) {
          console.log('📞 I am the CALLER - creating offer...');
          await this.call.startCall(
            this.roomId,
            this.userId,
            this.localVideoRef.nativeElement,
            this.remoteVideoRef.nativeElement
          );
        } else {
          console.log('📱 I am the JOINER - waiting for offer...');
          await this.call.joinCall(
            this.roomId,
            this.userId,
            this.localVideoRef.nativeElement,
            this.remoteVideoRef.nativeElement
          );
        }

        console.log('✅ Call initialized successfully');
      }, 100);
    } catch (error) {
      console.error('❌ Failed to initialize call:', error);
      this.connectionState.set('failed');
    }
  }



  private async loadAvailableDevices(): Promise<void> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.deviceList = devices.filter(device => device.kind === 'videoinput');
      console.log('📹 Available cameras:', this.deviceList.length);
    } catch (error) {
      console.error('❌ Error loading devices:', error);
    }
  }

  private monitorConnectionState(): void {
    // Poll connection state every second
    const interval = setInterval(() => {
      const state = this.call.getConnectionState();
      if (state !== this.connectionState()) {
        this.connectionState.set(state);
        console.log('🔗 Connection state changed:', state);
      }

      // Clear interval when component is destroyed or call ends
      if (state === 'closed' || state === 'disconnected') {
        clearInterval(interval);
      }
    }, 1000);
  }

  async start(): Promise<void> {
    try {
      await this.call.startCall(
        this.roomId,
        this.userId,
        this.localVideoRef.nativeElement,
        this.remoteVideoRef.nativeElement
      );

      // const stream = await navigator.mediaDevices.getUserMedia({
      //   video: true,
      //   audio: true
      // });

      // this.localVideoRef.nativeElement.srcObject = stream;
      // this.localVideoRef.nativeElement.muted = true;
      // await this.localVideoRef.nativeElement.play();

      console.log('✅ Call started');
    } catch (error) {
      console.error('❌ Error starting call:', error);
      this.connectionState.set('failed');
    }
  }

  async join(): Promise<void> {
    try {
      await this.call.joinCall(
        this.roomId,
        this.userId,
        this.localVideoRef.nativeElement,
        this.remoteVideoRef.nativeElement
      );

      // const stream = await navigator.mediaDevices.getUserMedia({
      //   video: true,
      //   audio: true
      // });

      // this.localVideoRef.nativeElement.srcObject = stream;
      // this.localVideoRef.nativeElement.muted = true;
      // await this.localVideoRef.nativeElement.play();

      console.log('✅ Joined call');
    } catch (error) {
      console.error('❌ Error joining call:', error);
      this.connectionState.set('failed');
    }
  }

  async toggleMic(): Promise<void> {
    try {
      const newState = !this.micOn();
      this.micOn.set(newState);
      await this.call.toggleMic(newState);
      console.log(`🎤 Microphone ${newState ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('❌ Error toggling microphone:', error);
    }
  }

  async toggleCam(): Promise<void> {
    try {
      const newState = !this.camOn();
      this.camOn.set(newState);
      await this.call.toggleCamera(newState);
      console.log(`📹 Camera ${newState ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('❌ Error toggling camera:', error);
    }
  }

  async switchCamera(event: Event): Promise<void> {
    const deviceId = (event.target as HTMLSelectElement).value
    try {
      if (deviceId) {
        await this.call.switchCamera(deviceId);
        console.log('📹 Switched to camera:', deviceId);
      }
    } catch (error) {
      console.error('❌ Error switching camera:', error);
    }
  }

  async retryConnection(): Promise<void> {
    try {
      console.log('🔄 Retrying connection...');
      this.connectionState.set('connecting');
      this.call.hangup(this.toUserId);
      setTimeout(async () => {
        await this.initializeCall();
      }, 2000);

    } catch (error) {
      console.error('❌ Error retrying connection:', error);
      this.connectionState.set('failed');
    }
  }

  hangup(): void {
    try {
      this.call.hangup(this.toUserId);
      this.cleanup();
      this.closeWindow();
    } catch (error) {
      console.error('❌ Error hanging up:', error);
    }
  }

  openCall(): void {
    try {
      const url = window.location.href;
      window.open(url, 'video-call', 'width=1200,height=800,resizable=yes');
      this.closeWindow();
    } catch (error) {
      console.error('❌ Error opening call in popup:', error);
    }
  }

  private cleanup(): void {
    setTimeout(() => {
      try {
        // Stop all media tracks
        const localVideo = this.localVideoRef?.nativeElement;
        if (localVideo && localVideo.srcObject) {
          const stream = localVideo.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          localVideo.srcObject = null;
        }

        const remoteVideo = this.remoteVideoRef?.nativeElement;
        if (remoteVideo && remoteVideo.srcObject) {
          remoteVideo.srcObject = null;
        }

        console.log('🧹 Cleaned up call component');
      } catch (error) {
        console.error('❌ Error during cleanup:', error);
      }
    }, 100)
  }

  private closeWindow(): void {
    try {
      if (this.isPopup) {
        window.close();
      } else {
        // Navigate back or to home if not in popup
        history.back();
      }
    } catch (error) {
      console.error('❌ Error closing window:', error);
    }
  }

  // Getter for template
  getConnectionStateDisplay(): string {
    const state = this.connectionState();
    switch (state) {
      case 'new': return 'Initializing';
      case 'connecting': return 'Connecting';
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'failed': return 'Connection Failed';
      case 'closed': return 'Call Ended';
      default: return state;
    }
  }
}