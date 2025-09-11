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
  private connectionState = 'disconnected';

  constructor(
    private authService: AuthService
  ) { }


  async init(roomId: string, localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {
    try {
      this.roomId = roomId;

      console.log(environment.stunServers)

      const iceServers = [
        ...environment.stunServers,
        ...environment.turnServers
      ];

      console.log(iceServers)

      this.pc = new RTCPeerConnection({
        iceServers,
        iceCandidatePoolSize: 10
      });

      console.log(this.pc)

      this.remoteStream = new MediaStream();
      remoteVideo.srcObject = this.remoteStream;

      console.log(remoteVideo)
      console.log(this.remoteStream)

      this.pc.onconnectionstatechange = () => {
        this.connectionState = this.pc!.connectionState;
        console.log('🔗 Connection state:', this.connectionState);

        if (this.connectionState === 'failed') {
          console.error('❌ WebRTC connection failed');
          this.handleConnectionFailure();
        }
      };

      this.pc.oniceconnectionstatechange = () => {
        console.log('❄️ ICE connection state:', this.pc!.iceConnectionState);
      };

      this.pc.onicegatheringstatechange = () => {
        console.log('🧊 ICE gathering state:', this.pc!.iceGatheringState);
      };

      this.pc.onicecandidate = e => {
        if (e.candidate) {
          console.log('📤 Sending ICE candidate');
          this.authService.sendIceCandidate(this.roomId, e.candidate.toJSON());
        }
      };

      this.pc.ontrack = e => {
        console.log('📥 Received remote track');
        e.streams[0].getTracks().forEach(t => {
          this.remoteStream?.addTrack(t);
        });
      };

      this.authService.onOffer$.subscribe(async ({ from, sdp }) => {
        console.log('📞 [Callee] Received offer from', from);
        await this.pc!.setRemoteDescription(sdp);
        const stream = await this.getMedia();
        console.log('🎥 [Callee] Got media stream:', stream.active);
        stream.getTracks().forEach(track => {
          console.log('➕ [Callee] Adding track:', track.kind);
          this.pc?.addTrack(track, stream);
        });
        const answer = await this.pc!.createAnswer();
        console.log('✅ [Callee] Created answer');
        await this.pc!.setLocalDescription(answer);
        this.authService.sendAnswer(this.roomId, answer);
        console.log('📤 [Callee] Sent answer');
      });

      this.authService.onAnswer$.subscribe(async ({ sdp }) => {
        try {
          if (!this.pc) return;
          console.log('📥 Received answer');
          await this.pc.setRemoteDescription(sdp);
        } catch (error) {
          console.error('❌ Error handling answer:', error);
        }
      });

      this.authService.onIce$.subscribe(async ({ candidate }) => {
        try {
          if (!this.pc) return;
          console.log('📥 Received ICE candidate');
          await this.pc.addIceCandidate(candidate);
        } catch (error) {
          console.error('❌ Error adding ICE candidate:', error);
        }
      });

      this.authService.onHangup$.subscribe(() => {
        console.log('📴 Received hangup');
        this.endCall(localVideo, remoteVideo);
      });

    } catch (error) {
      console.error('❌ Error initializing call service:', error);
      throw error;
    }
  }

  async startCall(roomId: string, userId: string, localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {
    try {
      this.isCaller = true;
      this.authService.join(roomId, userId);
      await this.init(roomId, localVideo, remoteVideo);

      const stream = await this.getMedia();

      localVideo.srcObject = stream;
      localVideo.muted = true;
      await localVideo.play();

      stream.getTracks().forEach(t => this.pc?.addTrack(t, stream));

      const offer = await this.pc!.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });

      await this.pc!.setLocalDescription(offer);
      this.authService.sendOffer(roomId, offer);
      console.log('📤 Sent offer');
    } catch (error) {
      console.error('❌ Error starting call:', error);
      throw error;
    }
  }

  async joinCall(roomId: string, userId: string, localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {
    try {
      this.isCaller = false;
      this.authService.join(roomId, userId);
      await this.init(roomId, localVideo, remoteVideo);

      // ✅ ADD: Get media and add tracks
      const stream = await this.getMedia();
      localVideo.srcObject = stream;
      localVideo.muted = true;
      await localVideo.play();

      // ✅ ADD: Add tracks to peer connection
      stream.getTracks().forEach(t => this.pc?.addTrack(t, stream));

      console.log('✅ Joined with media');
    } catch (error) {
      console.error(error)
    }
  }


  async toggleMic(enabled: boolean) {
    try {
      this.localStream?.getAudioTracks().forEach(t => {
        t.enabled = enabled;
      });
      console.log(`🎤 Microphone ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('❌ Error toggling microphone:', error);
    }
  }

  async toggleCamera(enabled: boolean) {
    try {
      this.localStream?.getVideoTracks().forEach(t => {
        t.enabled = enabled;
      });
      console.log(`📹 Camera ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('❌ Error toggling camera:', error);
    }
  }

  async switchCamera(deviceId: string) {
    try {
      const constraints: MediaStreamConstraints = {
        video: { deviceId: { exact: deviceId } },
        audio: true
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoTrack = newStream.getVideoTracks()[0];
      const sender = this.pc?.getSenders().find(s => s.track?.kind === 'video');

      if (sender) {
        await sender.replaceTrack(videoTrack);
        this.localStream?.getVideoTracks().forEach(t => t.stop());
        this.localStream = newStream;
        console.log('📹 Switched camera');
      }
    } catch (error) {
      console.error('❌ Error switching camera:', error);
    }
  }

  hangup() {
    try {
      if (!this.roomId) return;
      this.authService.sendHangup(this.roomId);
      console.log('📴 Sent hangup');
    } catch (error) {
      console.error('❌ Error hanging up:', error);
    }
  }

  private async getMedia(): Promise<MediaStream> {
    try {
      if (this.localStream) return this.localStream;

      // this.localStream = await navigator.mediaDevices.getUserMedia({
      //   video: {
      //     width: { ideal: 1280 },
      //     height: { ideal: 720 },
      //     facingMode: 'user'
      //   },
      //   audio: {
      //     echoCancellation: true,
      //     noiseSuppression: true,
      //     autoGainControl: true
      //   }
      // });

      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      console.log('🎥 Got user media');
      return this.localStream;
    } catch (error) {
      console.error('❌ Error getting user media:', error);
      throw new Error('Could not access camera/microphone. Please check permissions.');
    }
  }

  private handleConnectionFailure() {
    this.pc?.restartIce();
  }

  private endCall(localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {
    try {
      // Stop all tracks
      this.pc?.getSenders().forEach(s => s.track?.stop());
      this.pc?.getReceivers().forEach(r => r.track?.stop());

      // Close peer connection
      this.pc?.close();
      this.pc = undefined;

      // Stop local stream
      this.localStream?.getTracks().forEach(t => t.stop());
      this.localStream = undefined;

      // Clear video elements
      if (localVideo.srcObject) localVideo.srcObject = null;
      if (remoteVideo.srcObject) remoteVideo.srcObject = null;

      // Reset state
      this.roomId = '';
      this.isCaller = false;
      this.connectionState = 'disconnected';

      console.log('✅ Call ended successfully');
    } catch (error) {
      console.error('❌ Error ending call:', error);
    }
  }

  public generateRoomId = (userId: string, toUserId: string): string => {
    const sortedIds = [userId, toUserId].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
  }

  public getConnectionState = () => this.connectionState;

  public getIsCaller = (): boolean => this.isCaller
}
