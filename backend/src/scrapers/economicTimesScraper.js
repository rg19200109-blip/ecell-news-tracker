const { fetchHtml } = require('./common');

const source = 'Economic Times';

const scrapeEconomicTimes = async () => {
  const $ = await fetchHtml('https://economictimes.indiatimes.com/small-biz/startups');

  const stories = [];

  $('.eachStory').slice(0, 20).each((_, el) => {
    const title = $(el).find('h3 a, h4 a').first().text().trim();
    const href = $(el).find('a').first().attr('href');
    const summary = $(el).find('p').first().text().trim();
    const dateText = $(el).find('.date-format, time').first().text().trim();

    if (title && href) {
      stories.push({
        title,
        source,
        url: href.startsWith('http') ? href : `https://economictimes.indiatimes.com${href}`,
        date: dateText ? new Date(dateText) : new Date(),
        summary
      });
    }
  });

  return stories;
};

module.exports = { scrapeEconomicTimes };
