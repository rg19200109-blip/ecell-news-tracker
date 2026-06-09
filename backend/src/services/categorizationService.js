const categoryMatchers = {
  Funding: ['funding', 'raises', 'seed', 'series', 'valuation', 'invest'],
  Startups: ['startup', 'founder', 'launch', 'incubator', 'accelerator'],
  Events: ['event', 'summit', 'conference', 'meetup', 'webinar'],
  Jobs: ['hiring', 'jobs', 'career', 'talent', 'recruitment'],
  Markets: ['market', 'stocks', 'ipo', 'economy', 'growth'],
  Policy: ['policy', 'regulation', 'government', 'compliance', 'law']
};

const detectCategory = (text = '') => {
  const normalized = text.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryMatchers)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return category;
    }
  }

  return 'General';
};

module.exports = { detectCategory };
