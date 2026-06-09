const axios = require('axios');
const cheerio = require('cheerio');

const fetchHtml = async (url) => {
  const response = await axios.get(url, {
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Ecell-News-Tracker; +https://iimb.ac.in)'
    }
  });

  return cheerio.load(response.data);
};

module.exports = { fetchHtml };
