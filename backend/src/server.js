const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const { connectDatabase } = require('./config/database');
const { startSchedulers } = require('./services/schedulerService');

const bootstrap = async () => {
  await connectDatabase();
  startSchedulers();

  app.listen(env.port, () => {
    logger.info('Server started', { port: env.port, env: env.nodeEnv });
  });
};

bootstrap().catch((err) => {
  logger.error('Failed to bootstrap application', { error: err.message });
  process.exit(1);
});
