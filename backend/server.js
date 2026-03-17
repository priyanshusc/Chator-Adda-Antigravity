const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // For development, update in prod
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Set socket.io inside app to be used in controllers
app.set('socketio', io);

app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// Real-time connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_order', (orderId) => {
        socket.join(`order_${orderId}`);
        console.log(`Socket ${socket.id} joined room order_${orderId}`);
    });

    // Relay new orders directly to Admin Dashboard
    socket.on('new_order', (order) => {
        socket.broadcast.emit('new_order', order);
    });

    // Relay status updates to the specific order room
    socket.on('update_order_status', (data) => {
        io.to(`order_${data.orderId}`).emit('order_status_update', data);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
