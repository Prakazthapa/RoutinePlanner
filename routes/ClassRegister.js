const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Connect to SLgte database
const db = new sqlite3.Database('C:/Users/praka/OneDrive/Desktop/Routine Planner/database/class.db');

// Create 'class' table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS class (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    totalClasses INTEGER,
    classDuration INTEGER,
    startTime TEXT,
    endTime TEXT,
    includeBreaks INTEGER,
    breakDuration INTEGER,
    breakAfter INTEGER
)`);

// Handle form submission fm saveClassdet.html
router.post('/class-register', async (req, res) => {
    console.log("Request received to /class-register");

    const {
        totalClasses,
        classDuration,
        startTime,
        endTime,
        breakCheckbox,
        breakDuration,
        breakAfter 
    } = req.body;

    const includeBreaks = breakCheckbox ? 1 : 0;

    // Insert data into the 'class' table
    db.run(`INSERT INTO class (totalClasses, classDuration, startTime, endTime, includeBreaks, breakDuration, breakAfter) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [totalClasses, classDuration, startTime, endTime, includeBreaks, breakDuration, breakAfter],
        (err) => {
            if (err) {
                console.error('Error inserting data into the database:', err);
                return res.status(500).json({ error: 'Error inserting data into the database.' });
            }

            console.log('Data successfully saved to the database');
            res.status(200).json({ message: 'Data successfully saved to the database.' });
        });
});

module.exports = router;
