const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
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
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  unitNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
  fileName: {
    type: String,
    required: true,
    trim: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index for efficient queries
resourceSchema.index({ branchId: 1, semesterNumber: 1, subjectId: 1, unitNumber: 1 });

module.exports = mongoose.model('Resource', resourceSchema);