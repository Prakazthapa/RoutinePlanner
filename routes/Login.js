const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('C:/Users/praka/OneDrive/Desktop/Routine Planner/database/users.db');

// Middleware to initialize session
router.use((req, res, next) => {
    if (!req.session) {
        req.session = {}; // Initialize session object if undefined
    }
    next();
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    // Query the database to find the user
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        // If no user found with the given username
        if (!row) {
            return res.status(401).send('Invalid username or password');
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, row.password);
        if (!passwordMatch) {
            return res.status(401).send('Invalid username or password');
        }

        // Set session variables to indicate authentication
        req.session.authenticated = true;
        req.session.username = username;

        // Redirect to index page after successful login
        res.redirect('/Index.html');
    });
});

module.exports = router;
