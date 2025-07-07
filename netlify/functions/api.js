const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests
app.options('*', cors());

// Simple in-memory storage for testing
let users = [];
let exercises = [];

// API routes
app.post('/users', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = {
      username: username,
      _id: Date.now().toString()
    };
    
    users.push(user);

    res.json({
      username: user.username,
      _id: user._id
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/users/:_id/exercises', async (req, res) => {
  try {
    const { _id } = req.params;
    const { description, duration, date } = req.body;

    if (!description || !duration) {
      return res.status(400).json({ error: 'Description and duration are required' });
    }

    const user = users.find(u => u._id === _id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const exercise = {
      userId: _id,
      description,
      duration: parseInt(duration),
      date: date ? new Date(date) : new Date(),
      _id: Date.now().toString()
    };

    exercises.push(exercise);

    res.json({
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
      _id: user._id
    });
  } catch (error) {
    console.error('Error creating exercise:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/users/:_id/logs', async (req, res) => {
  try {
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    const user = users.find(u => u._id === _id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let userExercises = exercises.filter(e => e.userId === _id);

    if (from || to) {
      userExercises = userExercises.filter(exercise => {
        const exerciseDate = new Date(exercise.date);
        if (from && exerciseDate < new Date(from)) return false;
        if (to && exerciseDate > new Date(to)) return false;
        return true;
      });
    }

    if (limit) {
      userExercises = userExercises.slice(0, parseInt(limit));
    }

    const log = userExercises.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    }));

    res.json({
      username: user.username,
      count: userExercises.length,
      _id: user._id,
      log
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'API is working with in-memory storage'
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Export the handler
exports.handler = serverless(app); 