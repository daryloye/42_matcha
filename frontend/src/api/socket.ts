import { io, type Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL;

let socket: Socket | null = null;

// The JWT lives in an httpOnly cookie, so we never touch it directly here —
// `withCredentials: true` makes the browser attach it to the socket handshake,
// same as it does for the fetch calls in httpClient.tsx.
export function connectSocket(): Socket {
  if (socket) return socket;

  socket = io(API_URL, {
    withCredentials: true,
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
