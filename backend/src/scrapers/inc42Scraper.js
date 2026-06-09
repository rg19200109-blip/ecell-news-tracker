const { fetchHtml } = require('./common');

const source = 'Inc42';

const scrapeInc42 = async () => {
  const $ = await fetchHtml('https://inc42.com/buzz/');

  const stories = [];

  $('article').slice(0, 20).each((_, el) => {
    const title = $(el).find('h2, h3').first().text().trim();
    const href = $(el).find('a').first().attr('href');
    const summary = $(el).find('p').first().text().trim();
    const dateText = $(el).find('time').first().attr('datetime') || $(el).find('time').first().text().trim();

    if (title && href) {
      stories.push({
        title,
        source,
        url: href.startsWith('http') ? href : `https://inc42.com${href}`,
        date: dateText ? new Date(dateText) : new Date(),
        summary
      });
    }
  });

  return stories;
};

module.exports = { scrapeInc42 };
