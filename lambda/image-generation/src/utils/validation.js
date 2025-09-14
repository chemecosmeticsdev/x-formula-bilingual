// Validation utilities for image generation requests

function validateImageRequest(event) {
  const errors = [];

  // Check if request has body
  if (!event.body) {
    errors.push('Request body is required');
    return { isValid: false, errors };
  }

  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch (error) {
    errors.push('Invalid JSON in request body');
    return { isValid: false, errors };
  }

  // Validate prompt
  if (!body.prompt || typeof body.prompt !== 'string') {
    errors.push('Prompt is required and must be a string');
  } else if (body.prompt.trim().length === 0) {
    errors.push('Prompt cannot be empty');
  } else if (body.prompt.length > 2000) {
    errors.push('Prompt must be less than 2000 characters');
  }

  // Validate model (optional)
  if (body.model) {
    const validModels = ['amazon.nova-canvas-v1:0', 'amazon.titan-image-generator-v1'];
    if (!validModels.includes(body.model)) {
      errors.push(`Model must be one of: ${validModels.join(', ')}`);
    }
  }

  // Validate dimensions (optional)
  if (body.width) {
    if (!Number.isInteger(body.width) || body.width < 256 || body.width > 2048) {
      errors.push('Width must be an integer between 256 and 2048');
    }
  }

  if (body.height) {
    if (!Number.isInteger(body.height) || body.height < 256 || body.height > 2048) {
      errors.push('Height must be an integer between 256 and 2048');
    }
  }

  // Validate quality (optional)
  if (body.quality) {
    const validQualities = ['standard', 'premium'];
    if (!validQualities.includes(body.quality)) {
      errors.push(`Quality must be one of: ${validQualities.join(', ')}`);
    }
  }

  // Validate cfg_scale (optional)
  if (body.cfg_scale !== undefined) {
    if (typeof body.cfg_scale !== 'number' || body.cfg_scale < 1.0 || body.cfg_scale > 20.0) {
      errors.push('cfg_scale must be a number between 1.0 and 20.0');
    }
  }

  // Validate seed (optional)
  if (body.seed !== undefined) {
    if (!Number.isInteger(body.seed) || body.seed < 0 || body.seed > 2147483647) {
      errors.push('seed must be an integer between 0 and 2147483647');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    body
  };
}

function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove potentially harmful content
  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script-like patterns
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limit length
    .substring(0, 2000);
}

function validateEnvironmentVariables() {
  const required = ['BEDROCK_REGION', 'S3_BUCKET'];
  const missing = required.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate S3 bucket name format
  const bucketName = process.env.S3_BUCKET;
  const bucketNameRegex = /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/;
  if (!bucketNameRegex.test(bucketName) || bucketName.length < 3 || bucketName.length > 63) {
    throw new Error(`Invalid S3 bucket name: ${bucketName}`);
  }
}

module.exports = {
  validateImageRequest,
  sanitizeInput,
  validateEnvironmentVariables
};