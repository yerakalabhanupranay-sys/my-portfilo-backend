const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const logActivity = require('../utils/activityLogger');

// GET /api/services
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM services');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/services
router.put('/', auth, async (req, res) => {
    const services = req.body; // Expecting an array of services
    try {
        // Simple approach: Delete all and re-insert for bulk update
        // Or update individually if preferred. Bulk update is easier for dynamic lists.
        await db.query('BEGIN');
        await db.query('DELETE FROM services');
        for (const service of services) {
            await db.query(
                'INSERT INTO services (name, price, description) VALUES ($1, $2, $3)',
                [service.name, service.price, service.description]
            );
        }
        await db.query('COMMIT');
        await logActivity('Updated services', 'Settings');
        res.json({ message: 'Services updated' });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
