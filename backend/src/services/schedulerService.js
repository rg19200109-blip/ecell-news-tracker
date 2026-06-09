const cron = require('node-cron');
const env = require('../config/env');
const logger = require('../utils/logger');
const { fetchAndStoreNews } = require('./newsAggregatorService');
const { getMonthlyReport } = require('./newsService');
const { sendMonthlyDigestBatch } = require('./emailService');
const Subscription = require('../models/Subscription');

const startSchedulers = () => {
  cron.schedule(env.dailyCron, async () => {
    logger.info('Running daily news fetch');
    await fetchAndStoreNews();
  });

  cron.schedule(env.monthlyCron, async () => {
    logger.info('Running monthly digest job');
    const report = await getMonthlyReport();
    const subscriptions = await Subscription.find({ active: true }).select({ email: 1, _id: 0 });
    await sendMonthlyDigestBatch(report, subscriptions.map((item) => item.email));
  });

  logger.info('Schedulers initialized', { dailyCron: env.dailyCron, monthlyCron: env.monthlyCron });
};

module.exports = { startSchedulers };
