const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// File to store the visitor count
const counterFile = path.join(__dirname, 'visitorCount.json');

// Initialize counter file if it doesn't exist
async function initializeCounter() {
    try {
        await fs.access(counterFile);
    } catch {
        await fs.writeFile(counterFile, JSON.stringify({ count: 0 }));
    }
}

// Get current count
app.get('/api/count', async (req, res) => {
    try {
        const data = await fs.readFile(counterFile, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error reading count' });
    }
});

// Increment count
app.post('/api/increment', async (req, res) => {
    try {
        const data = await fs.readFile(counterFile, 'utf8');
        const counter = JSON.parse(data);
        counter.count++;
        await fs.writeFile(counterFile, JSON.stringify(counter));
        res.json(counter);
    } catch (error) {
        res.status(500).json({ error: 'Error updating count' });
    }
});

// Initialize counter and start server
initializeCounter().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
