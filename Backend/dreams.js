// Import required modules
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('./db');

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Create dream entry endpoint
router.post('/create', authenticateToken, async (req, res) => {
    try {
        console.log(req.bo)
        const { dream_text, dream_date } = req.body;
        const userId = req.user.userId;
        // Insert new dream entry into database

        console.log(dream_text, dream_date)

        pool.query('INSERT INTO dream_entries (user_id, dream_text, dream_date) VALUES (?, ?, ?)', [userId, dream_text, dream_date]);

        res.status(201).json({ message: 'Dream entry created successfully' });
    } catch (error) {
        console.error('Error creating dream entry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user's dream entries endpoint
router.get('/get', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        console.log(userId)

        const query = `SELECT * FROM dream_entries WHERE user_id = '${userId}'`;
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error selecting user:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (results.length === 0) {
                console.log('No dreams found :(');
                return res.status(404).json({ message: 'No dreams found' });
            } else {
                console.log('Dream found:', results);
                return res.json(results); // Return the dream entries
            }
        });
    } catch (error) {
        console.error('Error fetching user\'s dream entries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete dream entry endpoint
router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { dreamId } = req.body;

        // Check if the dream entry belongs to the user

        console.log(userId, dreamId)

        const query = `DELETE FROM dream_entries WHERE id = ? AND user_id = ?`;
        pool.query(query, [dreamId, userId], (error, result) => {
            if (error) {
                console.error('Error deleting dream entry:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Dream entry not found' });
            }

            console.log('Dream entry deleted successfully');
            return res.json({ message: 'Dream entry deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting dream entry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
