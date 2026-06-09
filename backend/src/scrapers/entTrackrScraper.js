const axios = require('axios');

const source = 'Entrackr';

const scrapeEntrackr = async () => {
  const response = await axios.get('https://entrackr.com/feed/', { timeout: 15000 });
  const xml = response.data || '';

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 20).map((entry) => {
    const block = entry[1];
    const title = (block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || '').trim();
    const url = (block.match(/<link>(.*?)<\/link>/)?.[1] || '').trim();
    const date = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];
    const summary = (block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || '')
      .replace(/<[^>]*>/g, '')
      .trim();

    return {
      title,
      source,
      url,
      date: date ? new Date(date) : new Date(),
      summary
    };
  });

  return items.filter((item) => item.title && item.url);
};

module.exports = { scrapeEntrackr };
