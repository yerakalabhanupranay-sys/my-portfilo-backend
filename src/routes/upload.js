const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const auth = require('../middleware/auth');

// POST /api/upload (Admin only)
router.post('/', auth, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('MULTER/CLOUDINARY ERROR:', err);
            return res.status(500).json({ message: 'Upload failed', error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log('File uploaded successfully:', req.file.path);
        res.json({ url: req.file.path });
    });
});

module.exports = router;
