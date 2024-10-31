const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite Database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS uploads (id INTEGER PRIMARY KEY, link TEXT)");
});

// Route to save a new file link
app.post('/api/upload', (req, res) => {
    const { link } = req.body;
    db.run("INSERT INTO uploads (link) VALUES (?)", [link], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, link });
    });
});

// Route to retrieve all uploaded links
app.get('/api/uploads', (req, res) => {
    db.all("SELECT * FROM uploads", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
