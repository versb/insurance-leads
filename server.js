const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./leads.db'); // SQLite database

// Set up Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create leads table if not exists
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT, message TEXT)");
});

// Route to handle form submission
app.post('/submit-lead', (req, res) => {
    const { name, email, phone, message } = req.body;
    const stmt = db.prepare("INSERT INTO leads (name, email, phone, message) VALUES (?, ?, ?, ?)");
    stmt.run(name, email, phone, message, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save lead.' });
        }
        res.status(200).json({ message: 'Lead captured successfully!' });
    });
    stmt.finalize();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
