const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const healthRoutes = require('./routes/healthRoutes');
const newsRoutes = require('./routes/newsRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const logger = require('./utils/logger');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

app.use('/api/health', healthRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.use((err, _req, res, _next) => {
  logger.error('Unhandled API error', { error: err.message, stack: err.stack });
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
