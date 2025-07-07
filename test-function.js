// Test script for Netlify function
const { handler } = require('./netlify/functions/api');

// Mock event for testing
const testEvent = {
  httpMethod: 'POST',
  path: '/users',
  body: JSON.stringify({ username: 'testuser' }),
  headers: {
    'Content-Type': 'application/json'
  }
};

// Mock context
const context = {};

// Test the function
async function testFunction() {
  try {
    console.log('Testing Netlify function...');
    const result = await handler(testEvent, context);
    console.log('Function result:', result);
  } catch (error) {
    console.error('Function error:', error);
  }
}

testFunction(); 