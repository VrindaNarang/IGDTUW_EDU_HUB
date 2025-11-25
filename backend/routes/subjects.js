const express = require('express');
const Subject = require('../models/Subject');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get subjects for a specific branch and semester
router.get('/:branchId/:semester', requireAuth, async (req, res) => {
  try {
    const { branchId, semester } = req.params;
    const subjects = await Subject.find({ branchId, semesterNumber: parseInt(semester) });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new subject (admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { branchId, semesterNumber, subjectName } = req.body;
    const subject = new Subject({ branchId, semesterNumber, subjectName });
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Subject already exists for this branch and semester' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Delete subject (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;