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

            socket.on('join', (userId) => {
                socket.join(userId)
                socket.data.userId = userId;
                console.log(`👤 User ${userId} joined their room`)
            })

            socket.on('call:offer', ({ to, sdp }) => {
                socket.to(to).emit('call:offer', { from: socket.data.userId, sdp });
            });

            socket.on('call:answer', ({ to, sdp }) => {
                socket.to(to).emit('call:answer', { from: socket.data.userId, sdp });
            });

            socket.on('ice-candidate', ({ to, candidate }) => {
                socket.to(to).emit('ice-candidate', { from: socket.data.userId, candidate });
            });

            socket.on('hangup', ({ to }) => {
                socket.to(to).emit('hangup', { from: socket.data.userId });
            });

            socket.on('disconnect', () => {
                console.log(`🔴 Socket disconnected: ${socket.id}`);
            });
        });
        return io;
    } catch (error) {
        console.error('❌ Socket initiation error', error)
    }
}