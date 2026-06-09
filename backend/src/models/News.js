const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    source: { type: String, required: true },
    category: {
      type: String,
      enum: ['Funding', 'Startups', 'Events', 'Jobs', 'Markets', 'Policy', 'General'],
      default: 'General'
    },
    url: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    summary: { type: String, default: '' }
  },
  { timestamps: true }
);

newsSchema.index({ date: -1, category: 1, source: 1 });

module.exports = mongoose.model('News', newsSchema);
