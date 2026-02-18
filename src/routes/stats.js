const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// POST /api/stats/increment
// Increments the view count for today
router.post('/increment', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        // UPSERT: Insert date or increment count if exists
        await db.query(
            'INSERT INTO page_views (view_date, count) VALUES ($1, 1) ON CONFLICT (view_date) DO UPDATE SET count = page_views.count + 1',
            [today]
        );
        res.json({ message: 'View incremented' });
    } catch (err) {
        console.error('POST /api/stats/increment error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/stats/dashboard (Admin only)
// Fetches all stats for the dashboard
router.get('/dashboard', auth, async (req, res) => {
    try {
        // 1. Total Views
        const viewsRes = await db.query('SELECT SUM(count) as total_views FROM page_views');
        const totalViews = parseInt(viewsRes.rows[0].total_views) || 0;

        // 2. Counts
        const projectsCountRes = await db.query('SELECT COUNT(*) FROM projects');
        const servicesCountRes = await db.query('SELECT COUNT(*) FROM services');
        const messagesCountRes = await db.query('SELECT COUNT(*) FROM contacts');

        // 3. Recent Activities (limit 5)
        const activitiesRes = await db.query('SELECT * FROM activities ORDER BY created_at DESC LIMIT 5');

        res.json({
            totalViews,
            projectsCount: parseInt(projectsCountRes.rows[0].count),
            servicesCount: parseInt(servicesCountRes.rows[0].count),
            messagesCount: parseInt(messagesCountRes.rows[0].count),
            recentActivities: activitiesRes.rows
        });
    } catch (err) {
        console.error('GET /api/stats/dashboard error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
