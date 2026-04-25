const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Path for persistent storage on Render (e.g., /data/data.json)
const DATA_FILE = process.env.PERSISTENT_STORAGE 
    ? path.join(process.env.PERSISTENT_STORAGE, 'data.json') 
    : path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist in the persistent path
if (!fs.existsSync(DATA_FILE)) {
    const localDataFile = path.join(__dirname, 'data.json');
    if (fs.existsSync(localDataFile)) {
        fs.copyFileSync(localDataFile, DATA_FILE);
    } else {
        const initialData = { config: { appName: "Burger Lab", primaryColor: "#FF512F", secondaryColor: "#DD2476", logoBase64: "" }, items: [] };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
}


app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

// API Endpoints
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/data', (req, res) => {
    const newData = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing data:', err);
            return res.status(500).json({ error: 'Failed to save data' });
        }
        res.json({ success: true, message: 'Data saved successfully' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
