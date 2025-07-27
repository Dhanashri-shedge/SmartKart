const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();

// ✅ CORS configuration — use '*' temporarily OR set final deployed URL only
const corsOptions = {
  origin: '*',  // ✅ Use '*' only if testing — replace with deployed frontend URL for production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = socketIo(server, {
  cors: corsOptions,
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartkart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/dev', require('./routes/dev-orders'));
app.use('/api/dev', require('./routes/dev'));

// ✅ Socket.IO events
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`📦 User ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

app.set('io', io);

// ✅ Serve frontend build (IMPORTANT — must match actual folder name)
const __dirnameFull = path.resolve();
app.use(express.static(path.join(__dirnameFull, 'client', 'build')));

// ✅ Fallback to React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirnameFull, 'client', 'build', 'index.html'));
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
