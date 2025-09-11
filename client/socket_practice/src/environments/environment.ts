// export const environment = {
//     production: true,
//     signalingUrl: 'hosted-backend-url(https)',
//     stunServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//         { urls: 'stun:stun1.l.google.com:19302' }
//     ]
// }

export const environment = {
  production: true,
  signalingUrl: 'hosted-backend-url(https)', // Your production Socket.IO server
  stunServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'stun:stun1.l.google.com:19302'
    },
    {
      urls: 'stun:global.stun.twilio.com:3478'
    }
  ],
  turnServers: [
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ]
};
