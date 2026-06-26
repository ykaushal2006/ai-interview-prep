const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resumeText: { type: String },
  jobDescription: { type: String },
  questions: [{ type: String }],
  transcript: [
    {
      question: String,
      answer: String,
    }
  ],
  status: { type: String, default: 'ongoing' }, // ongoing | completed
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);