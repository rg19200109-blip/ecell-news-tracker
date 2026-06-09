const News = require('../models/News');
const logger = require('../utils/logger');
const { detectCategory } = require('./categorizationService');
const { scrapeEntrackr } = require('../scrapers/entTrackrScraper');
const { scrapeEconomicTimes } = require('../scrapers/economicTimesScraper');
const { scrapeInc42 } = require('../scrapers/inc42Scraper');
const { scrapeStartupApi } = require('../scrapers/startupApiScraper');

const sourceLoaders = [
  { name: 'Entrackr', run: scrapeEntrackr },
  { name: 'Economic Times', run: scrapeEconomicTimes },
  { name: 'Inc42', run: scrapeInc42 },
  { name: 'Startup API', run: scrapeStartupApi }
];

const normalizeDate = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const fetchAndStoreNews = async () => {
  let insertedCount = 0;

  for (const loader of sourceLoaders) {
    try {
      const items = await loader.run();

      for (const item of items) {
        const category = detectCategory(`${item.title} ${item.summary}`);
        const doc = {
          title: item.title,
          source: item.source || loader.name,
          category,
          url: item.url,
          date: normalizeDate(item.date),
          summary: item.summary || ''
        };

        const result = await News.updateOne({ url: doc.url }, { $setOnInsert: doc }, { upsert: true });
        insertedCount += result.upsertedCount || 0;
      }

      logger.info('Source scrape complete', { source: loader.name, fetched: items.length });
    } catch (err) {
      logger.error('Source scrape failed', { source: loader.name, error: err.message });
    }
  }

  return { insertedCount };
};

module.exports = { fetchAndStoreNews };
