import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import routes from './routes/central.routes.js'

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/rchat', routes)

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err))

const server = app.listen(port, () => {
    console.log(`🚀 Server listening on http://localhost:${port}`)
})

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
        io.emit('receive-message', {...data, userId});
    });

    socket.on('disconnect', () => {
        console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
});