import { Server } from "socket.io";

export const initSocket = async (server) => {
    try {
        const io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_ORIGIN,
                methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
            }
        })

        io.on('connection', (socket) => {
            console.log(`🟢 Socket connected: ${socket.id}`);

            socket.on('join', (data) => {
                let userId, roomId;
                if (typeof data === 'string') {
                    userId = data;
                    socket.join(userId);
                    socket.data.userId = userId;
                    console.log(`👤 User ${userId} joined their personal room`);
                } else if (data.roomId && data.userId) {
                    roomId = data.roomId;
                    userId = data.userId;
                    socket.join(roomId);
                    socket.data.userId = userId;
                    socket.data.roomId = roomId;
                    console.log(`👥 User ${userId} joined call room ${roomId}`);
                    socket.to(roomId).emit('user-joined', { userId });
                }
            })

            socket.on('call:offer', ({ roomId, sdp }) => {
                console.log(`📞 Offer from ${socket.data.userId} in room ${roomId}`);
                socket.to(roomId).emit('call:offer', {
                    from: socket.data.userId,
                    sdp
                });
            });

            socket.on('call:answer', ({ roomId, sdp }) => {
                console.log(`✅ Answer from ${socket.data.userId} in room ${roomId}`);
                socket.to(roomId).emit('call:answer', {
                    from: socket.data.userId,
                    sdp
                });
            });

            socket.on('ice-candidate', ({ roomId, candidate }) => {
                console.log(`❄️ ICE candidate from ${socket.data.userId} in room ${roomId}`);
                socket.to(roomId).emit('ice-candidate', {
                    from: socket.data.userId,
                    candidate
                });
            });

            socket.on('hangup', ({ toUserId }) => {
                console.log(`🛑 Hangup from ${socket.data.userId}`);
                socket.to(toUserId).emit('hangup', {
                    from: socket.data.userId
                });
                if (socket.data.roomId) {
                    socket.leave(socket.data.roomId);
                    socket.data.roomId = null;
                }
            });

            socket.on('initiate-call', ({ toUserId, roomId, callerName }) => {
                console.log(`📱 Call initiated from ${socket.data.userId} to ${toUserId}`);
                socket.to(toUserId).emit('incoming-call', {
                    from: socket.data.userId,
                    roomId,
                    callerName
                });
            });

            socket.on('accept-call', ({ roomId, callerId }) => {
                console.log(`✅ Call accepted by ${socket.data.userId}`);
                socket.to(callerId).emit('call-accepted', {
                    roomId,
                    acceptedBy: socket.data.userId
                });
            });

            socket.on('reject-call', ({ callerId }) => {
                console.log(`❌ Call rejected by ${socket.data.userId}`);
                socket.to(callerId).emit('call-rejected', {
                    rejectedBy: socket.data.userId
                });
            });

            socket.on('disconnect', () => {
                console.log(`🔴 Socket disconnected: ${socket.id}`);

                // Clean up rooms on disconnect
                if (socket.data.roomId) {
                    socket.to(socket.data.roomId).emit('user-left', {
                        userId: socket.data.userId
                    });
                }
            });
        });
        return io;
    } catch (error) {
        console.error('❌ Socket initiation error', error)
    }
}