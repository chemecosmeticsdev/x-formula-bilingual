const https = require('https');

exports.handler = async (event) => {
  console.log('Image proxy Lambda called with event:', JSON.stringify(event, null, 2));

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Forward request to the working Lambda function via direct invocation
    const AWS = require('aws-sdk');
    const lambda = new AWS.Lambda({ region: 'us-east-1' });

    const params = {
      FunctionName: 'BedrockImageGeneration',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(event)
    };

    console.log('Forwarding request to us-east-1 Lambda...');
    const result = await lambda.invoke(params).promise();

    if (result.FunctionError) {
      console.error('Lambda function error:', result.FunctionError);
      throw new Error(`Lambda function error: ${result.FunctionError}`);
    }

    const response = JSON.parse(result.Payload);
    console.log('Received response from us-east-1 Lambda');

    return response;

  } catch (error) {
    console.error('Image proxy error:', error);

    const errorResponse = {
      success: false,
      error: error.message,
      errorType: error.name,
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(errorResponse)
    };
  }
};