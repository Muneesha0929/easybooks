require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const journalRoutes = require('./src/routes/journal.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware - UPDATED CORS to allow all localhost ports
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps)
    if (!origin) return callback(null, true);
    
    // Allow any localhost port (handles 4200, 52371, etc.)
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    // Allow 127.0.0.1 as well
    if (origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // Reject other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'EasyBooks API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 EasyBooks API: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
