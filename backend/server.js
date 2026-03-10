console.log("🚀 THIS IS THE REAL SERVER FILE RUNNING");
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

const app = express();

/* =========================
   CONNECT DATABASE
========================= */

connectDB();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

/* =========================
   HEALTH CHECK
========================= */

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'EasyBooks API is running',
    timestamp: new Date().toISOString()
  });
});

/* =========================
   IMPORT ROUTES
========================= */

const authRoutes = require('./src/routes/auth.routes');
const journalRoutes = require('./src/routes/journal.routes');

/* =========================
   ROUTE MOUNTING
========================= */

app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);

/* =========================
   TEST ROUTE (DEBUG)
========================= */

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: "Server routing working"
  });
});

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 EasyBooks API: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});