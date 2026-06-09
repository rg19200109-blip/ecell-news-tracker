const News = require('../models/News');

const allowedCategories = new Set(['Funding', 'Startups', 'Events', 'Jobs', 'Markets', 'Policy', 'General']);

const safeString = (value) => (typeof value === 'string' ? value.trim() : '');
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const safeDate = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const listNews = async (query) => {
  const {
    category,
    source,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 20
  } = query;

  const filter = {};
  const safeCategory = safeString(category);
  const safeSource = safeString(source);
  const safeSearch = safeString(search);
  const parsedStartDate = safeDate(startDate);
  const parsedEndDate = safeDate(endDate);

  if (safeCategory && allowedCategories.has(safeCategory)) {
    filter.category = safeCategory;
  }
  if (safeSource) filter.source = safeSource;
  if (safeSearch) {
    const searchPattern = new RegExp(escapeRegex(safeSearch), 'i');
    filter.$or = [
      { title: searchPattern },
      { summary: searchPattern }
    ];
  }
  if (parsedStartDate || parsedEndDate) {
    filter.date = {};
    if (parsedStartDate) filter.date.$gte = parsedStartDate;
    if (parsedEndDate) filter.date.$lte = parsedEndDate;
  }

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const [items, total] = await Promise.all([
    News.find(filter).sort({ date: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
    News.countDocuments(filter)
  ]);

  return {
    items,
    total,
    page: safePage,
    pages: Math.ceil(total / safeLimit),
    limit: safeLimit
  };
};

const getMonthlyReport = async (month) => {
  const baseDate = month ? new Date(`${month}-01`) : new Date();
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);

  const [items, categoryBreakdown, sourceBreakdown] = await Promise.all([
    News.find({ date: { $gte: start, $lt: end } }).sort({ date: -1 }),
    News.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    News.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
  ]);

  return {
    month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
    totalNews: items.length,
    categoryBreakdown: categoryBreakdown.map((entry) => ({ category: entry._id, count: entry.count })),
    sourceBreakdown: sourceBreakdown.map((entry) => ({ source: entry._id, count: entry.count })),
    topStories: items.slice(0, 10)
  };
};

const getAnalyticsSummary = async () => {
  const [totalNews, categoryBreakdown, sourceBreakdown] = await Promise.all([
    News.countDocuments(),
    News.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    News.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }, { $sort: { count: -1 } }])
  ]);

  return {
    totalNews,
    categoryBreakdown: categoryBreakdown.map((entry) => ({ category: entry._id, count: entry.count })),
    sourceBreakdown: sourceBreakdown.map((entry) => ({ source: entry._id, count: entry.count }))
  };
};

module.exports = { listNews, getMonthlyReport, getAnalyticsSummary };
