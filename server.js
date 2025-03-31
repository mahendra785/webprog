import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Adjust this in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join a room for the current video (you might want to use videoId)
    socket.on("join:room", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Broadcast play event to all other clients in the same room
    socket.on("player:play", (time, roomId) => {
      socket.to(roomId).emit("player:play", time);
      console.log(`Broadcasting play event to room ${roomId} at time ${time}`);
    });

    // Broadcast pause event to all other clients in the same room
    socket.on("player:pause", (time, roomId) => {
      socket.to(roomId).emit("player:pause", time);
      console.log(`Broadcasting pause event to room ${roomId} at time ${time}`);
    });

    // Broadcast seek event to all other clients in the same room
    socket.on("player:seek", (time, roomId) => {
      socket.to(roomId).emit("player:seek", time);
      console.log(`Broadcasting seek event to room ${roomId} to time ${time}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});