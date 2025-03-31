import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

export const socket = io(URL, {
  autoConnect: false, // We'll connect manually after the component mounts
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
