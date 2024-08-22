const mongoose = require('mongoose');

const dailySummarySchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    enum: ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'],
  },
  date: {
    type: Date,
    required: true,
  },
  avgTemp: {
    type: Number,
    default: 0, // Set default value
    required: true,
  },
  avgPress: {
    type: Number,
    default: 0, // Set default value
    required: true,
  },
  avgHumidity: {
    type: Number,
    default: 0, // Set default value
    required: true,
  },
  avgwindspeed: {
    type: Number,
    default: 0, // Set default value
    required: true,
  },
  maxTemp: {
    type: Number,
    required: true,
  },
  minTemp: {
    type: Number,
    required: true,
  },
  dominantCondition: {
    type: String, // Most frequent weather condition of the day
    required: true,
  },
  conditionCount: {
    type: Map,
    of: Number, // To store counts of each condition
    default: {}, // Initialize as an empty map
  },
  readingsCount: {
    type: Number,
    default: 0,
  },
});

const DailySummary = mongoose.model('DailySummary', dailySummarySchema);

module.exports = DailySummary;
