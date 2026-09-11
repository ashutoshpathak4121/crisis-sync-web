const Redis = require('ioredis');
const EventEmitter = require('events');
const logger = require('../utils/logger');
const env = require('./env');

class InMemoryRedisFallback extends EventEmitter {
  constructor() {
    super();
    this.store = new Map();
    this.isFallback = true;
  }

  async get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key, value, mode, duration) {
    let expiresAt = null;
    if (mode && (mode.toUpperCase() === 'EX' || mode.toUpperCase() === 'PX')) {
      const ms = mode.toUpperCase() === 'EX' ? duration * 1000 : duration;
      expiresAt = Date.now() + ms;
    }
    this.store.set(key, { value: String(value), expiresAt });
    return 'OK';
  }

  async del(key) {
    return this.store.delete(key) ? 1 : 0;
  }

  async keys(pattern) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    const matched = [];
    const now = Date.now();
    for (const [k, item] of this.store.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.store.delete(k);
        continue;
      }
      if (regex.test(k)) {
        matched.push(k);
      }
    }
    return matched;
  }

  async flushall() {
    this.store.clear();
    return 'OK';
  }

  async ping() {
    return 'PONG';
  }

  async publish(channel, message) {
    this.emit(channel, message);
    return 1;
  }

  async subscribe(channel, callback) {
    this.on(channel, callback);
    return 1;
  }

  quit() {
    this.store.clear();
    return Promise.resolve('OK');
  }

  disconnect() {
    this.store.clear();
  }
}

let redisClient;

if (process.env.NODE_ENV === 'test' || !env.REDIS_URL || env.REDIS_URL === 'none') {
  redisClient = new InMemoryRedisFallback();
} else {
  try {
    const client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null, // Do not endlessly retry if Redis is down
      enableOfflineQueue: false,
      connectTimeout: 500,
      lazyConnect: true
    });

    client.connect().then(() => {
      logger.info('Connected to Redis Server successfully');
      redisClient = client;
    }).catch(() => {
      logger.warn('Redis Server offline. Using In-Memory Redis Cache Fallback.');
      redisClient = new InMemoryRedisFallback();
    });

    client.on('error', () => {
      if (!redisClient || redisClient.isFallback) return;
      redisClient = new InMemoryRedisFallback();
    });

    redisClient = client;
  } catch (err) {
    redisClient = new InMemoryRedisFallback();
  }
}

module.exports = redisClient;
