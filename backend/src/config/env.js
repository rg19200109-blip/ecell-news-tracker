const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/ecell-news-tracker',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  dailyCron: process.env.DAILY_FETCH_CRON || '0 8 * * *',
  monthlyCron: process.env.MONTHLY_DIGEST_CRON || '0 9 1 * *',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  digestEmail: process.env.DIGEST_EMAIL || 'rg19200109@gmail.com'
};
