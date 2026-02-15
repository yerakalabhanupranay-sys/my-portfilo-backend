const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// POST /api/contact
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await db.query(
            'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)',
            [name, email, message]
        );
        res.json({ message: 'Message sent successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/contact (Admin only)
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
