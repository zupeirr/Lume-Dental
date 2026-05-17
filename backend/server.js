require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');


const authRoutes = require('./routes/authRoutes');

const app = express();

// Place CORS at the very top to intercept preflight requests before security middlewares
app.use(cors({
  origin: (origin, callback) => callback(null, origin || true), // Reflect exact origin back
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again in 15 minutes'
});
app.use('/api', limiter);

// Middleware — restrict CORS to configured origins

app.use(express.json({ limit: '10kb' })); // Body parser limit

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test Route
app.get('/', (req, res) => {
  res.send('Lume Dental API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
