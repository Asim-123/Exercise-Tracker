const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple test route
app.post('/users', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Mock response without database
    res.json({
      username: username,
      _id: 'mock-id-' + Date.now(),
      message: 'This is a test response without database'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    res.json([
      { username: 'testuser1', _id: 'mock-id-1' },
      { username: 'testuser2', _id: 'mock-id-2' }
    ]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports.handler = serverless(app); 