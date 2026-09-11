const logger = require('../utils/logger');
const { initSocketEmitter } = require('./socketEmitter');

const setupSocketIO = (io) => {
  initSocketEmitter(io);

  io.on('connection', (socket) => {
    logger.info(`Client connected via WebSockets: ${socket.id}`);

    // Join specialized rooms for role or hospital scoping
    socket.on('join:room', (room) => {
      socket.join(room);
      logger.info(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('leave:room', (room) => {
      socket.leave(room);
      logger.info(`Socket ${socket.id} left room: ${room}`);
    });

    // Ambulance real-time GPS beacon push
    socket.on('ambulance:telemetry', (data) => {
      // Broadcast to other monitoring clients
      socket.broadcast.emit('ambulance:location-updated', {
        ambulanceId: data.ambulanceId,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Client disconnected [${socket.id}]: ${reason}`);
    });
  });
};

module.exports = setupSocketIO;
