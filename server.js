const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on('moveCard', (data) => {
        socket.to(data.roomId).emit('cardMoved', data);
    });

    socket.on('updateHp', (data) => {
        socket.to(data.roomId).emit('hpUpdated', data);
    });

    socket.on('syncDeck', (data) => {
        socket.to(data.roomId).emit('deckSynced', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
