//Runtime (Node.js), the Framework (Express), and the Communication Protocol (Socket.io).
// refer this for manual https://expressjs.com/en/4x/api.html#express.json

import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express"; //framework
import helmet from "helmet";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io"; //library
import { testConnection } from "./config/database";
import createTables from "./config/initDB";
import authRouter from "./routes/auth.routes";

dotenv.config(); //this reads my env file and makes variables available via process.env.PORT

const app: Application = express(); //Express application. Its job is to handle standard requests (HTTP).
const httpServer = createServer(app); //Node js httpServer

//this is for the handshake; a walkie talkie system for talking and pushes updates
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//middleware
app.use(helmet()); //default security headers to help protect against various attacks
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

//static files for uploads
app.use("/uploads", express.static("uploads"));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Matcha API is running",
    timestamp: new Date().toISOString(),
  });
});

//socket.io connection handling
io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
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

const PORT = process.env.PORT || 5001;

// this will start the server
httpServer.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);

  await testConnection(); //wrote this to test database
  await createTables();
});

export { io };
