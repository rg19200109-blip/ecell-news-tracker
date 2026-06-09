const News = require('../models/News');

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

  if (category) filter.category = category;
  if (source) filter.source = source;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { summary: { $regex: search, $options: 'i' } }
    ];
  }
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
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
