import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
dotenv.config(); //this reads my env file and makes variables available via process.env.PORT

const app: Application = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, { ... });