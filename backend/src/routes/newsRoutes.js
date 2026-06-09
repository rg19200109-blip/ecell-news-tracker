const express = require('express');
const { listNews, getMonthlyReport, getAnalyticsSummary } = require('../services/newsService');
const { fetchAndStoreNews } = require('../services/newsAggregatorService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await listNews(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/fetch', async (_req, res, next) => {
  try {
    const result = await fetchAndStoreNews();
    res.json({ message: 'News fetch completed', ...result });
  } catch (err) {
    next(err);
  }
});

router.get('/reports/monthly', async (req, res, next) => {
  try {
    const report = await getMonthlyReport(req.query.month);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

router.get('/analytics/summary', async (_req, res, next) => {
  try {
    const analytics = await getAnalyticsSummary();
    res.json(analytics);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
