const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/profile
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM profile LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/profile (Admin only)
router.put('/', auth, async (req, res) => {
    const { name, headline, bio, email, whatsapp, resume_url, github_url, linkedin_url, twitter_url } = req.body;
    try {
        const result = await db.query('SELECT id FROM profile LIMIT 1');
        if (result.rows.length === 0) {
            // Create if none exists
            await db.query(
                'INSERT INTO profile (name, headline, bio, email, whatsapp, resume_url, github_url, linkedin_url, twitter_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [name, headline, bio, email, whatsapp, resume_url, github_url, linkedin_url, twitter_url]
            );
        } else {
            // Update
            await db.query(
                'UPDATE profile SET name = $1, headline = $2, bio = $3, email = $4, whatsapp = $5, resume_url = $6, github_url = $7, linkedin_url = $8, twitter_url = $9 WHERE id = $10',
                [name, headline, bio, email, whatsapp, resume_url, github_url, linkedin_url, twitter_url, result.rows[0].id]
            );
        }
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
