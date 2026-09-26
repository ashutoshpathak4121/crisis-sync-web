const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const ambulanceRoutes = require('./routes/ambulanceRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const routeRoutes = require('./routes/routeRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const userPortalRoutes = require('./routes/userPortalRoutes');
const hospitalPortalRoutes = require('./routes/hospitalPortalRoutes');
const adminPortalRoutes = require('./routes/adminPortalRoutes');

const app = express();

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for hackathon demo convenience
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global API rate limiting
app.use('/api', apiLimiter);

// Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CrisisSync Real-Time Core API',
    version: '1.0.0'
  });
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userPortalRoutes);
app.use('/api/hospital', hospitalPortalRoutes);
app.use('/api/admin', adminPortalRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/ambulances', ambulanceRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/simulation', simulationRoutes);

// Catch 404s and unhandled errors
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
