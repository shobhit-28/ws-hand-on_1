import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class CallServiceService {
  private pc?: RTCPeerConnection
  private roomId = ''
  private localStream?: MediaStream
  private remoteStream?: MediaStream
  private isCaller = false

  constructor(
    private authService: AuthService
  ) { }


  async init(roomId: string, localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {
    this.roomId = roomId
    this.pc = new RTCPeerConnection({ iceServers: environment.stunServers })
    this.remoteStream = new MediaStream()
    remoteVideo.srcObject = this.remoteStream

    this.pc.onicecandidate = e => {
      if (e.candidate) this.authService.sendIceCandidate(this.roomId, e.candidate.toJSON())
    }

    this.pc.ontrack = e => {
      e.streams[0].getTracks().forEach(t => this.remoteStream?.addTrack(t))
    }

    this.authService.onOffer$.subscribe(async ({ sdp }) => {
      if (!this.pc) return
      await this.pc.setRemoteDescription(sdp)
      const stream = await this.getMedia()
      stream.getTracks().forEach(t => this.pc?.addTrack(t, stream))
      const answer = await this.pc.createAnswer()
      await this.pc.setLocalDescription(answer)
      this.authService.sendAnswer(this.roomId, answer)
    })

    this.authService.onAnswer$.subscribe(async ({ sdp }) => {
      if (!this.pc) return
      await this.pc.setRemoteDescription(sdp)
    })

    this.authService.onIce$.subscribe(async ({ candidate }) => {
      if (!this.pc) return
      try { await this.pc.addIceCandidate(candidate) } catch { }
    })

    this.authService.onHangup$.subscribe(() => this.endCall(localVideo, remoteVideo))
  }

  async startCall(roomId: string, userId: string, localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {
    this.isCaller = true
    this.authService.join(roomId, userId)
    await this.init(roomId, localVideo, remoteVideo)
    const stream = await this.getMedia()
    stream.getTracks().forEach(t => this.pc?.addTrack(t, stream))
    const offer = await this.pc!.createOffer()
    await this.pc!.setLocalDescription(offer)
    this.authService.sendOffer(roomId, offer)
  }

  async joinCall(roomId: string, userId: string, localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {
    this.isCaller = false
    this.authService.join(roomId, userId)
    await this.init(roomId, localVideo, remoteVideo)
  }

  async toggleMic(enabled: boolean) {
    this.localStream?.getAudioTracks().forEach(t => t.enabled = enabled)
  }

  async toggleCamera(enabled: boolean) {
    this.localStream?.getVideoTracks().forEach(t => t.enabled = enabled)
  }

  async switchCamera(deviceId: string) {
    const constraints: MediaStreamConstraints = { video: { deviceId: { exact: deviceId } }, audio: true }
    const newStream = await navigator.mediaDevices.getUserMedia(constraints)
    const videoTrack = newStream.getVideoTracks()[0]
    const sender = this.pc?.getSenders().find(s => s.track?.kind === 'video')
    await sender?.replaceTrack(videoTrack)
    this.localStream?.getTracks().forEach(t => t.stop())
    this.localStream = newStream
  }

  hangup() {
    if (!this.roomId) return
    this.authService.sendHangup(this.roomId)
  }

  private async getMedia() {
    if (this.localStream) return this.localStream
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    return this.localStream
  }

  private endCall(localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {
    this.pc?.getSenders().forEach(s => s.track?.stop())
    this.pc?.getReceivers().forEach(r => r.track?.stop())
    this.pc?.close()
    this.pc = undefined
    this.localStream?.getTracks().forEach(t => t.stop())
    this.localStream = undefined
    if (localVideo.srcObject) localVideo.srcObject = null
    if (remoteVideo.srcObject) remoteVideo.srcObject = null
    this.roomId = ''
    this.isCaller = false
  }
}
