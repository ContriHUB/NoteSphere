const connectToMongo = require('./db');

connectToMongo();

const express = require('express')
const cors = require('cors')
const app = express()
const multer = require('multer'); //for image storage
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000', // Specify the allowed origin
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));
const port =5000

const http = require('http'); // Import http module
const setupSocket = require('./socket/socket'); // Import your socket setup
const server = http.createServer(app); // Create HTTP server

// Error handling for Multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        return res.status(400).send({ error: err.message });
    } else if (err) {
        // Handle other errors
        return res.status(500).send({ error: err.message });
    }
    next();
});

// Setup Socket.io with the created server
const io = setupSocket(server);

// Middleware to attach Socket.io instance to req
app.use((req, res, next) => {
    req.io = io; // Attach socket instance to req
    next();
});

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))
app.use('/api/admin', require('./routes/adminAuth')); // Admin authentication routes
app.use('/api/admin', require('./routes/adminDashboard')); // Admin dashboard routes
app.use('/api/announcements', require('./routes/announcements'))


server.listen(port, () => {
    console.log(`e-feedback listening app at http://localhost:${port}`);
});