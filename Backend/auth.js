const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('./db');

function getUserByUsername(username, callback) {
    const query = `SELECT * FROM users WHERE username = '${username}'`;
    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error selecting user:', error);
            callback(error, null);
            return;
        }

        if (results.length === 0) {
            console.log('User not found');
            callback(null, null); // User not found, pass null as the result
        } else {
            console.log('User found:', results[0]);
            callback(null, results[0]); // Pass the user as the result
        }
    });
}

// Register endpoint
router.post('/register', async (req, res) => {
    // Validation for empty fields
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check if username is already taken
        getUserByUsername(username, async (error, user) => {
            if (error) {
                console.error('Error occurred:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (user) {
                console.log('User already exists!');
                return res.status(400).json({ message: 'Username already exists' });
            } else {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert new user into database
                pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (error, result) => {
                    if (error) {
                        console.error('Error inserting new user:', error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    console.log('User registered successfully');
                    res.status(201).json({ message: 'User registered successfully' });
                });
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    // Validation for empty fields
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check if username exists
        getUserByUsername(username, async (error, user) => {
            if (error) {
                console.error('Error occurred:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (!user) {
                console.log('User not found');
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Compare passwords
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                console.log('Invalid password');
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Generate token
            const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

            res.json({ token });
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
