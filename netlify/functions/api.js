// Simple in-memory storage for testing
let users = [];
let exercises = [];

exports.handler = async function(event, context) {
  console.log('API function called with event:', event);
  
  const { httpMethod, path, body, queryStringParameters } = event;
  
  // Parse body if it exists
  let parsedBody = {};
  if (body) {
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      console.error('Error parsing body:', e);
    }
  }
  
  // Set CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  };
  
  // Handle preflight requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight successful' })
    };
  }
  
  // Route handling
  if (path === '/api/health') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'API is working with in-memory storage'
      })
    };
  }
  
  if (path === '/api/test') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'API is working!',
        method: httpMethod,
        path: path,
        timestamp: new Date().toISOString()
      })
    };
  }
  
  if (path === '/api/users' && httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(users)
    };
  }
  
  if (path === '/api/users' && httpMethod === 'POST') {
    try {
      const { username } = parsedBody;
      
      if (!username) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Username is required' })
        };
      }

      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Username already exists' })
        };
      }

      const user = {
        username: username,
        _id: Date.now().toString()
      };
      
      users.push(user);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          username: user.username,
          _id: user._id
        })
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server error' })
      };
    }
  }
  
  // Handle /users/:_id/exercises
  if (path.match(/^\/api\/users\/[^\/]+\/exercises$/) && httpMethod === 'POST') {
    try {
      const userId = path.split('/')[3]; // Extract user ID from path
      const { description, duration, date } = parsedBody;

      if (!description || !duration) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Description and duration are required' })
        };
      }

      const user = users.find(u => u._id === userId);
      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'User not found' })
        };
      }

      const exercise = {
        userId: userId,
        description,
        duration: parseInt(duration),
        date: date ? new Date(date) : new Date(),
        _id: Date.now().toString()
      };

      exercises.push(exercise);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          username: user.username,
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date.toDateString(),
          _id: user._id
        })
      };
    } catch (error) {
      console.error('Error creating exercise:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server error' })
      };
    }
  }
  
  // Handle /users/:_id/logs
  if (path.match(/^\/api\/users\/[^\/]+\/logs$/) && httpMethod === 'GET') {
    try {
      const userId = path.split('/')[3]; // Extract user ID from path
      const { from, to, limit } = queryStringParameters || {};

      const user = users.find(u => u._id === userId);
      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'User not found' })
        };
      }

      let userExercises = exercises.filter(e => e.userId === userId);

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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          username: user.username,
          count: userExercises.length,
          _id: user._id,
          log
        })
      };
    } catch (error) {
      console.error('Error fetching logs:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server error' })
      };
    }
  }
  
  // Default response for unmatched routes
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ 
      error: 'Route not found',
      path: path,
      method: httpMethod
    })
  };
}; 