import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const port = 5001;

const server = app.listen(port, () => {
    console.log(`on port: ${port}, Server is listening`)
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