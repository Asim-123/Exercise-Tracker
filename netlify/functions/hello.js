exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Netlify Function!",
      event: event,
      path: event.path,
      method: event.httpMethod
    })
  };
}; 