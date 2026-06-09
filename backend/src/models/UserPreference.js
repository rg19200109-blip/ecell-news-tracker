const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    categories: {
      type: [String],
      default: ['Funding', 'Startups', 'Events', 'Jobs', 'Markets', 'Policy']
    },
    monthlyDigestEnabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserPreference', userPreferenceSchema);
