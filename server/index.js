import express from "express";
import { WebSocketServer } from "ws";
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

import authRoutes from './routes/auth.routes.js'

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json())

app.use('/rchat/auth', authRoutes)

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err))

const server = app.listen(port, () => {
    console.log(`🚀 Server listening on http://localhost:${port}`)
})

// const webSocketServer = new WebSocketServer({ port: 5002})
const webSocketServer = new WebSocketServer({ server })

webSocketServer.on('connection', (socket) => {
    socket.on('message', (data) => {
        try {
            const strValue = data.toString();
            console.log(`data from client \n`, JSON.parse(strValue))
        } catch (error) {
            console.log(`data from client \n`, data.toString())
        }
        socket.send(`Thanks buddy`)
    })
})