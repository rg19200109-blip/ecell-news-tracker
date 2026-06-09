const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../utils/logger');

const buildTransport = () => {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });
};

const sendMonthlyDigest = async (report, recipient = env.digestEmail) => {
  const transporter = buildTransport();

  if (!transporter) {
    logger.info('SMTP not configured, monthly digest skipped', { recipient });
    return { skipped: true };
  }

  const categorySummary = report.categoryBreakdown
    .map((item) => `${item.category}: ${item.count}`)
    .join(', ');

  const html = `
    <h2>E-Cell Monthly Startup Digest (${report.month})</h2>
    <p>Total stories tracked: <strong>${report.totalNews}</strong></p>
    <p>Category breakdown: ${categorySummary || 'No stories this month'}</p>
    <h3>Top Stories</h3>
    <ul>
      ${report.topStories.map((story) => `<li><a href="${story.url}">${story.title}</a> (${story.source})</li>`).join('')}
    </ul>
  `;

  await transporter.sendMail({
    from: env.smtpUser,
    to: recipient,
    subject: `E-Cell News Digest - ${report.month}`,
    html
  });

  logger.info('Monthly digest sent', { recipient, month: report.month });
  return { skipped: false };
};

module.exports = { sendMonthlyDigest };
