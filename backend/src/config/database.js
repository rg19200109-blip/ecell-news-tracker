const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection failed', { error: err.message });
    throw err;
  }
};

module.exports = { connectDatabase };
