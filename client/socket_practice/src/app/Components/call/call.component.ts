import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
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
export class CallComponent implements OnInit {
  @ViewChild('localVideo') localVideoRef!: ElementRef<HTMLVideoElement>
  @ViewChild('remoteVideo') remoteVideoRef!: ElementRef<HTMLVideoElement>

  roomId = ''
  userId = ''
  participants = signal(0)
  micOn = signal(true)
  camOn = signal(true)
  deviceList: MediaDeviceInfo[] = []

  constructor(
    private route: ActivatedRoute,
    private call: CallServiceService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    this.roomId = this.route.snapshot.queryParamMap.get('roomId') || ''
    this.userId = this.route.snapshot.queryParamMap.get('userId') || ''

    if (this.roomId && this.userId) {
      await this.call.joinCall(
        this.roomId,
        this.userId,
        this.localVideoRef.nativeElement,
        this.remoteVideoRef.nativeElement
      )
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      this.localVideoRef.nativeElement.srcObject = stream
      this.localVideoRef.nativeElement.muted = true
      await this.localVideoRef.nativeElement.play()
    }
  }

  async start() {
    await this.call.startCall(this.roomId, this.userId, this.localVideoRef.nativeElement, this.remoteVideoRef.nativeElement)
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    this.localVideoRef.nativeElement.srcObject = stream
    this.localVideoRef.nativeElement.muted = true
    await this.localVideoRef.nativeElement.play()
  }

  async join() {
    await this.call.joinCall(this.roomId, this.userId, this.localVideoRef.nativeElement, this.remoteVideoRef.nativeElement)
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    this.localVideoRef.nativeElement.srcObject = stream
    this.localVideoRef.nativeElement.muted = true
    await this.localVideoRef.nativeElement.play()
  }

  async toggleMic() {
    this.micOn.update(v => !v)
    await this.call.toggleMic(this.micOn())
  }

  async toggleCam() {
    this.camOn.update(v => !v)
    await this.call.toggleCamera(this.camOn())
  }

  async switchCamera(deviceId: string) {
    await this.call.switchCamera(deviceId)
  }

  hangup() {
    this.call.hangup();
    window.close()
  }
}
