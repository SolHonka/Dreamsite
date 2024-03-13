const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken'); // For token generation/validation
const bcrypt = require('bcrypt'); // For password hashing
const app = express();
const PORT = process.env.PORT || 5000;

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'dreamsite'
});

app.use(express.json());

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Check if username already exists
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Insert new user into database
        await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if username exists
        const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (user.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user[0].password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate token
        const token = jwt.sign({ userId: user[0].id }, 'your_secret_key', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.json(req.user);
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Create dream entry endpoint
app.post('/dreams', authenticateToken, async (req, res) => {
    try {
        const { dream_text, dream_date } = req.body;
        const { userId } = req.user;

        await pool.query('INSERT INTO dream_entries (user_id, dream_text, dream_date) VALUES (?, ?, ?)', [userId, dream_text, dream_date]);
        res.status(201).json({ message: 'Dream entry created successfully' });
    } catch (error) {
        console.error('Error creating dream entry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user's dream entries endpoint
app.get('/dreams', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const userDreams = await pool.query('SELECT * FROM dream_entries WHERE user_id = ?', [userId]);
        res.json(userDreams);
    } catch (error) {
        console.error('Error fetching user\'s dream entries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
