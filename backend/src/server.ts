import express, { Application, Request, Response } from 'express'; //framework
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io'; //library
import helmet from 'helmet';
dotenv.config(); //this reads my env file and makes variables available via process.env.PORT

const app: Application = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'https://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://localhost:5173',
    credentials: true
}));
app.use

io.on('connection', (socket) => {
    console.log('user connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});