import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

import routes from './routes/central.routes.js'
import { connectDB } from "./config/db.js";
import { initSocket } from "./config/socket.js";
import { apiNotFoundHandler, globalErrorHandler } from "./middleware/errorHandler.js";
import { asyncHandler } from "./middleware/asyncHandler.js";
import { authenticateToken } from "./middleware/auth.middleware.js";

export const startServer = async () => {
    const app = express();
    const port = process.env.PORT || 5000;

    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());

    app.use('/rchat', routes)

    // app.use(asyncHandler)

    app.use(apiNotFoundHandler)
    app.use(globalErrorHandler)

    await connectDB()

    const server = app.listen(port, () => {
        console.log(`🚀 Server listening on http://localhost:${port}`)
    })

    const io = await initSocket(server)

    app.set(`io`, io)
} 