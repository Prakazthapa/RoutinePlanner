const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Connect to SQLite database
const db = new sqlite3.Database('C:/Users/praka/OneDrive/Desktop/Routine Planner/database/users.db');

// Create users table if it doesn't exist
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");

    // Sample user data (replace with actual data)
    const userData = [
        
        { username: 'aa', password:'123'}
    ];

    // Counter to track number of insertions
    let insertedCount = 0;

    // Insert sample user data into the database
    userData.forEach(({ username, password }) => {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
            } else {
                db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
                    if (err) {
                        console.error('Error inserting user:', err);
                    } else {
                        console.log(`User ${username} inserted successfully.`);
                    }

                    // Increment counter after each insertion
                    insertedCount++;

                    // Check if all data has been inserted
                    if (insertedCount === userData.length) {
                        // Close the database connection after all data has been inserted
                        db.close((err) => {
                            if (err) {
                                console.error('Error closing database:', err);
                            } else {
                                console.log('Database connection closed successfully.');
                            }
                        });
                    }
                });
            }
        });
    });
});
