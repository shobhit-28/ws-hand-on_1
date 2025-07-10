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
                console.log(`👤 User ${userId} joined their room`)
            })

            socket.on('disconnect', () => {
                console.log(`🔴 Socket disconnected: ${socket.id}`);
            });
        });
        return io;
    } catch (error) {
        console.error('❌ Socket initiation error', error)
    }
}