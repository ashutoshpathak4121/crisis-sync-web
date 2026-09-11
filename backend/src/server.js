const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const setupSocketIO = require('./sockets/socketHandler');

const server = http.createServer(app);

// Initialize Socket.io with robust CORS settings
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for dev/demo testing
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  pingTimeout: 20000,
  pingInterval: 25000
});

// Setup real-time listeners and broadcaster reference
setupSocketIO(io);

const PORT = env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`=======================================================`);
  logger.info(`CrisisSync Backend Server running on port ${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`REST API: http://localhost:${PORT}/api/health`);
  logger.info(`WebSockets: ws://localhost:${PORT}`);
  logger.info(`=======================================================`);
});

module.exports = { app, server, io };
