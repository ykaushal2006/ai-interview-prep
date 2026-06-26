const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadResume, startInterview, answerQuestion } = require('../controllers/interviewController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads folder if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'), false);
    }
  },
});

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/start', protect, startInterview);
router.post('/answer', protect, answerQuestion);

module.exports = router;