const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportText: { type: String },
  score: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);