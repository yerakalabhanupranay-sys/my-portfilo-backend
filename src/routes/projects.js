const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const logActivity = require('../utils/activityLogger');

// GET /api/projects
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM projects ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/projects
router.post('/', auth, async (req, res) => {
    const { title, description, tech_stack, live_url, image_url } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO projects (title, description, tech_stack, live_url, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, tech_stack, live_url, image_url]
        );
        await logActivity(`Created project: ${title}`, 'Briefcase');
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/projects/:id
router.put('/:id', auth, async (req, res) => {
    const { title, description, tech_stack, live_url, image_url } = req.body;
    try {
        await db.query(
            'UPDATE projects SET title = $1, description = $2, tech_stack = $3, live_url = $4, image_url = $5 WHERE id = $6',
            [title, description, tech_stack, live_url, image_url, req.params.id]
        );
        await logActivity(`Updated project: ${title}`, 'Briefcase');
        res.json({ message: 'Project updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/projects/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        await db.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
        await logActivity(`Deleted project (ID: ${req.params.id})`, 'Briefcase');
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
