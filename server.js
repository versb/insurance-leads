const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
let db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Could not open database', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT
  )
`);

// Routes
app.post('/submit-lead', (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' });
  }

  const stmt = db.prepare("INSERT INTO leads (name, email, phone, message) VALUES (?, ?, ?, ?)");
  stmt.run([name, email, phone, message], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Lead submitted successfully!', id: this.lastID });
  });
  stmt.finalize();
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
