// Importing required modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Setting up Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serving static files
app.use(express.static('public'));

// Handling client connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Broadcast when a new user joins
    socket.broadcast.emit('message', 'A new user has joined the chat');

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    // Notify when a user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        socket.broadcast.emit('message', 'A user has left the chat');
    });
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
