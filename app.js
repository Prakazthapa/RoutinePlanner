const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');



// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 300000 // Set session expiration time to 1 minute
    }
}));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Login.html'));
});
app.get('/staff-register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'StaffRegister.html'));
});





app.post('/show-routine', (req, res) => {
    
   
});





app.post('/staff-register', (req, res) => {
// SQLite database setupdatabase
const db = new sqlite3.Database('C:/Users/praka/OneDrive/Desktop/Routine Planner/database/teachers.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the teachers database.');
        // Create the teachers table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS teachers (
            teacherId TEXT,
            teacherName TEXT,
            subject TEXT,
            startTime TEXT,
            endTime TEXT
        )`);
    }

    const teacherData = req.body;
    console.log("teacherdata",teacherData);
    // Server-side validation (you can add more checks as needed)
    if (!teacherData.teacherName || !teacherData.teacherId || !teacherData.subject || !teacherData.startTime || !teacherData.endTime) {
        res.status(400).json({ message: 'Please fill in all required fields.' });
        return;
    }

    // Insert each time pair into the database
    const insertTeacherSql = `INSERT INTO teachers (teacherId, teacherName, subject, startTime, endTime) VALUES (?, ?, ?, ?, ?)`;

    // Iterate over each time pair and insert it into the database
    // teacherData.times.forEach(timePair => {
        db.run(insertTeacherSql, [teacherData.teacherId, teacherData.teacherName, teacherData.subject, teacherData.startTime, teacherData.endTime], (err) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
            console.log(`Teacher ${teacherData.teacherId} registered successfully for time pair: ${teacherData.startTime} - ${teacherData.endTime}`);
        });
    // });

    // res.status(200).json({ message: 'Teacher registered successfully.' });
    res.redirect("/Index.html");
});
});







app.post('/class-register', (req, res) => {

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
    // Connect to SQLite database
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
            res.redirect('/Index.html');

        });


    
    // res.status(200).send('Class registration successful!');

    // Or, if you want to redirect the user to another page after the registration
});
// Serve static files from the 'views' directory
app.use(express.static(path.join(__dirname, 'views')));

// Route for serving the login page at the root path


// Routes setup for other functionalities
app.use('/login', require('./routes/Login')); // Use the Login route handler

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
