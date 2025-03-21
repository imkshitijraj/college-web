const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Configure rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// File to store the visitor count
const counterFile = path.join(__dirname, 'visitorCount.json');

// Initialize counter file if it doesn't exist
async function initializeCounter() {
    try {
        await fs.access(counterFile);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(counterFile, JSON.stringify({ count: 0 }));
        } else {
            console.error('Error initializing counter:', error);
            throw error;
        }
    }
}

// Get current count
app.get('/api/count', async (req, res) => {
    try {
        const data = await fs.readFile(counterFile, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading count:', error);
        res.status(500).json({ error: 'Error reading count', details: error.message });
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
        console.error('Error updating count:', error);
        res.status(500).json({ error: 'Error updating count', details: error.message });
    }
});

// Add registration endpoint
app.post('/api/register', express.json(), async (req, res) => {
    try {
        // Basic validation
        const requiredFields = ['name', 'email'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Here you would typically save to a database
        // For now, we'll just return success
        res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Error processing registration:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Initialize counter and start server
initializeCounter()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    });
