const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  semesterNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  subjectName: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

// Compound index to ensure unique subject per branch and semester
subjectSchema.index({ branchId: 1, semesterNumber: 1, subjectName: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);