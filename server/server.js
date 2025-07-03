import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

import routes from './routes/central.routes.js'
import { connectDB } from "./config/db.js";
import { initSocket } from "./config/socket.js";

export const startServer = async () => {
    const app = express();
    const port = process.env.PORT || 5000;

    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());

    app.use('/rchat', routes)

    await connectDB()

    const server = app.listen(port, () => {
        console.log(`🚀 Server listening on http://localhost:${port}`)
    })

    await initSocket(server)
} 