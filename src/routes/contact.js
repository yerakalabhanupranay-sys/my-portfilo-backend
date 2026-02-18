const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const logActivity = require('../utils/activityLogger');

// POST /api/contact
router.post('/', async (req, res) => {
    const { name, email, message, phone } = req.body;
    try {
        await db.query(
            'INSERT INTO contacts (name, email, message, phone) VALUES ($1, $2, $3, $4)',
            [name, email, message, phone || null]
        );
        await logActivity(`New message received from ${name}`, 'MessageSquare');
        res.json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error('POST /api/contact error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/contact (Admin only)
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/contact error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/contact/:id (Admin only)
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM contacts WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json({ message: 'Message deleted successfully' });
    } catch (err) {
        console.error('DELETE /api/contact/:id error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
