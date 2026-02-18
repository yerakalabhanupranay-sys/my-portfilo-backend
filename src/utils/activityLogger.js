const db = require('../config/db');

/**
 * Logs an activity to the database.
 * @param {string} action - Description of the action performed.
 * @param {string} icon - Lucide icon name to associate with the activity.
 */
const logActivity = async (action, icon) => {
    try {
        await db.query(
            'INSERT INTO activities (action, icon) VALUES ($1, $2)',
            [action, icon]
        );
    } catch (err) {
        console.error('Error logging activity:', err.message);
    }
};

module.exports = logActivity;
