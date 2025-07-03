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

            socket.on('send-message', (data, userId) => {
                console.log('📨 Message received:', data, userId);
                io.emit('receive-message', { ...data, userId });
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