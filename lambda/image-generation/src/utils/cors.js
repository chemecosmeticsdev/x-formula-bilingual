// CORS utilities for Lambda API Gateway responses

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  'Access-Control-Allow-Credentials': false,
  'Content-Type': 'application/json'
};

function createSuccessResponse(data, message = 'Success') {
  const responseBody = {
    success: true,
    message: message,
    timestamp: new Date().toISOString(),
    ...(typeof data === 'object' ? data : { data })
  };

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(responseBody)
  };
}

function createErrorResponse(statusCode, error, details = null) {
  const responseBody = {
    success: false,
    error: error,
    statusCode: statusCode,
    timestamp: new Date().toISOString(),
    ...(details && { details })
  };

  return {
    statusCode: statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(responseBody)
  };
}

function handleOptionsRequest() {
  return {
    statusCode: 200,
    headers: {
      ...CORS_HEADERS,
      'Access-Control-Max-Age': '86400' // 24 hours
    },
    body: JSON.stringify({ message: 'CORS preflight' })
  };
}

module.exports = {
  createSuccessResponse,
  createErrorResponse,
  handleOptionsRequest,
  CORS_HEADERS
};