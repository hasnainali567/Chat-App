import {Server} from 'socket.io';
import http from 'http';    
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const userSocketsMap = {};

export const getReciverSocketId = (receiverId) => {
    return userSocketsMap[receiverId];
}

io.on('connection', (socket) => {

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketsMap[userId] = socket.id;
    }
    
    io.emit('getOnlineUsers', Object.keys(userSocketsMap));
    socket.on('disconnect', () => {
        delete userSocketsMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketsMap));
    });
});

export {io, server, app};