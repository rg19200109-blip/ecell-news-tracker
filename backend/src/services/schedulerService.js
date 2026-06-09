const cron = require('node-cron');
const env = require('../config/env');
const logger = require('../utils/logger');
const { fetchAndStoreNews } = require('./newsAggregatorService');
const { getMonthlyReport } = require('./newsService');
const { sendMonthlyDigest } = require('./emailService');

const startSchedulers = () => {
  cron.schedule(env.dailyCron, async () => {
    logger.info('Running daily news fetch');
    await fetchAndStoreNews();
  });

  cron.schedule(env.monthlyCron, async () => {
    logger.info('Running monthly digest job');
    const report = await getMonthlyReport();
    await sendMonthlyDigest(report);
  });

  logger.info('Schedulers initialized', { dailyCron: env.dailyCron, monthlyCron: env.monthlyCron });
};

module.exports = { startSchedulers };
