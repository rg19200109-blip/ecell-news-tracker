const axios = require('axios');

const source = 'Startup News API';

const scrapeStartupApi = async () => {
  const response = await axios.get('https://hn.algolia.com/api/v1/search_by_date?query=startup&tags=story', {
    timeout: 15000
  });

  const hits = response.data?.hits || [];

  return hits.slice(0, 20).map((hit) => ({
    title: hit.title || hit.story_title,
    source,
    url: hit.url || hit.story_url,
    date: hit.created_at ? new Date(hit.created_at) : new Date(),
    summary: hit._highlightResult?.title?.value?.replace(/<[^>]*>/g, '') || 'Startup ecosystem update'
  })).filter((item) => item.title && item.url);
};

module.exports = { scrapeStartupApi };
