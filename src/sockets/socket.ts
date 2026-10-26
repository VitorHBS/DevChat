import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

export function initializeSocket(server: HttpServer) {
    const io = new Server(server)

    io.on('connection', (socket) => {

        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('chat message', (msg) => {
            io.emit('chat message', msg)
        })
    })
}