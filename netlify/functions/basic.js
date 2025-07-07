exports.handler = async function(event, context) {
  console.log('Function called with event:', event);
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    },
    body: JSON.stringify({
      message: 'Basic function is working!',
      method: event.httpMethod,
      path: event.path,
      timestamp: new Date().toISOString()
    })
  };
}; 