// const zmq = require('zeromq');
// const http = require('http');
// const { Server } = require('socket.io');

import zmq from 'zeromq';
import http from 'http';
import { Server } from 'socket.io';
// Membuat server HTTP
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ZeroMQ Subscriber
async function runFrameSubscriber() {
  const sock = new zmq.Subscriber();
  sock.connect("tcp://localhost:5555");
  sock.subscribe("");

  console.log("Listening for ZeroMQ messages...");

  for await (const [msg] of sock) {
    console.log("Received ZeroMQ message");
    io.emit("frame", msg);
  }
}

async function runCountSubscriber() {
  const countSock = new zmq.Subscriber();
  countSock.connect("tcp://localhost:5556");
  countSock.subscribe("");

  console.log("Listening for ZeroMQ count messages...");

  for await (const [msg] of countSock) {
    const objectCount = msg.toString(); // Jumlah objek sebagai string
    io.emit("count", objectCount);
  }
}


runFrameSubscriber();
runCountSubscriber();

server.listen(4000, () => {
  console.log("WebSocket server listening on port 4000");
});
