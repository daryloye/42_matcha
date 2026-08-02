//Runtime (Node.js), the Framework (Express), and the Communication Protocol (Socket.io).
// refer this for manual https://expressjs.com/en/4x/api.html#express.json

import cors from "cors";
import dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express"; //framework
import helmet from "helmet";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io"; //library
import { testDatabaseConnection } from "./config/database";
import createTables from "./config/initDB";
import authRouter from "./routes/auth.routes";
import profileRouter from "./routes/profile.routes";
import matchRouter from "./routes/match.routes";
import chatRouter from "./routes/chat.routes";
import searchRouter from "./routes/search.routes";
import cookieParser from 'cookie-parser';
import multer from "multer";
import jwt from "jsonwebtoken";
import notificationRouter from "./routes/notification.routes";

dotenv.config(); //this reads my env file and makes variables available via process.env.BACKEND_PORT

const allowedOrigins = `${process.env.APP_HOSTNAME}:${process.env.FRONTEND_PORT}`;

const app: Application = express(); //Express application. Its job is to handle standard requests (HTTP).
const httpServer = createServer(app); //Node js httpServer

//this is for the handshake; a walkie talkie system for talking and pushes updates
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//middleware
app.use(helmet({
  crossOriginResourcePolicy: {policy: 'cross-origin'}
}));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/notifications", notificationRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/match", matchRouter);
app.use("/api/chat", chatRouter);
app.use("/api/search", searchRouter);


//static files for uploads
app.use("/uploads", express.static("uploads"));

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ error: "File too large. Maximum size is 5MB" });
      return;
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({ error: "Too many files uploaded" });
      return;
    }

    res.status(400).json({ error: err.message });
    return;
  }
  if (err.message === "INVALID_FILE_TYPE") {
    res.status(400).json({ error: "Invalid file type. Only JPEG, PNG and WebP are allowed" });
    return;
  }
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Matcha API is running",
    timestamp: new Date().toISOString(),
  });
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if(!token){
    return next(new Error("Authentication Error"));
  }
  try{
    const jwtSecret = process.env.JWT_SECRET;
    if(!jwtSecret){
      throw new Error("JWT_SECRET not defined");
    } 
      const decoded = jwt.verify(token, jwtSecret!) as unknown as { userId: string};
      socket.data.userId = decoded.userId;
      next();
  }catch{
    next (new Error("Authentication error"))
  }
})

//socket.io connection handling
// io.on("connection", (socket) => {
//   console.log("user connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  console.log(`user connected: ${socket.id}, userId: ${userId} `)

  //JOIN PERSONAL ROOM
  socket.join(userId);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}, userId: ${userId}`);
  });
});

//404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response) => {
  console.log("Error:", err);
  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

const PORT = process.env.BACKEND_PORT || process.env.PORT || 5001;

httpServer.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  if(!await testDatabaseConnection())  {
    process.exit(1);
  }
  if(!await createTables()){
    process.exit(1);
  }
});

// https.createServer(
//   {
//     key: fs.readFileSync("/certs/localhost-key.pem"),
//     cert: fs.readFileSync("/certs/localhost.pem"),
//   },
//   app,
// ).listen(process.env.BACKEND_PORT, async () => {
//   console.log(`HTTPS server running on https://localhost:${process.env.BACKEND_PORT}`);

//   if (!await testDatabaseConnection()) {
//     process.exit(1);
//   }
  
//   if (!await createTables()) {
//     process.exit(1);
//   }
// })

export { io };
