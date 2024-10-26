const socketIo = require('socket.io');
const Announcement = require('../models/Announcement');

const setupSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "http://localhost:3000", // Allow requests from this origin
            credentials: true // Allow credentials if needed
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected: ' + socket.id);

        // Send all previous announcements on connection
        Announcement.find().sort({ createdAt: -1 }).then(announcements => {
            socket.emit('initialAnnouncements', announcements);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected: ' + socket.id);
        });
    });

    return io;
};

module.exports = setupSocket;