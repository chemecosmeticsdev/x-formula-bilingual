const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const BedrockImageService = require('./services/bedrock-image');
const S3Service = require('./services/s3');
const { createSuccessResponse, createErrorResponse, handleOptionsRequest } = require('./utils/cors');
const { validateImageRequest, sanitizeInput } = require('./utils/validation');

// Initialize services
let bedrockImageService = null;
let s3Service = null;

function initializeServices() {
  if (!bedrockImageService) {
    bedrockImageService = new BedrockImageService();
  }
  if (!s3Service) {
    s3Service = new S3Service();
  }
}

async function generateImageHandler(event, context) {
  console.log('Received image generation request:', JSON.stringify(event, null, 2));

  // Initialize services
  initializeServices();

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return handleOptionsRequest();
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'Method Not Allowed', 'Only POST requests are supported');
  }

  try {
    // Validate request
    const validation = validateImageRequest(event);
    if (!validation.isValid) {
      return createErrorResponse(400, 'Validation Error', validation.errors);
    }

    const { body } = validation;

    // Sanitize inputs
    const sanitizedPrompt = sanitizeInput(body.prompt);
    if (!sanitizedPrompt || sanitizedPrompt.trim().length === 0) {
      return createErrorResponse(400, 'Invalid Input', 'Prompt cannot be empty after sanitization');
    }

    console.log('Processing image generation request...');
    console.log('Model:', body.model || 'amazon.nova-canvas-v1:0');
    console.log('Prompt length:', sanitizedPrompt.length);

    // Set default parameters
    const imageParams = {
      prompt: sanitizedPrompt,
      model: body.model || 'amazon.nova-canvas-v1:0',
      width: body.width || 1024,
      height: body.height || 1024,
      quality: body.quality || 'premium',
      cfg_scale: body.cfg_scale || 8.0,
      seed: body.seed || Math.floor(Math.random() * 1000000)
    };

    // Generate image using Bedrock
    console.log('Calling Bedrock for image generation...');
    const imageResult = await bedrockImageService.generateImage(imageParams);

    if (!imageResult.success) {
      // Try fallback model if Nova Canvas fails
      if (imageParams.model === 'amazon.nova-canvas-v1:0') {
        console.log('Nova Canvas failed, trying Titan Image Generator...');
        imageParams.model = 'amazon.titan-image-generator-v1';
        const fallbackResult = await bedrockImageService.generateImage(imageParams);

        if (!fallbackResult.success) {
          return createErrorResponse(502, 'Image Generation Failed', 'Both Nova Canvas and Titan failed to generate image');
        }

        // Upload to S3 and get public URL
        const s3Result = await s3Service.uploadImage(fallbackResult.imageData, imageParams);

        return createSuccessResponse({
          success: true,
          imageUrl: s3Result.publicUrl,
          s3_url: s3Result.publicUrl,
          model: imageParams.model,
          metadata: {
            width: imageParams.width,
            height: imageParams.height,
            model: imageParams.model,
            timestamp: new Date().toISOString()
          }
        }, 'Image generated successfully with fallback model');
      }

      return createErrorResponse(502, 'Image Generation Failed', imageResult.error);
    }

    // Upload to S3 and get public URL
    console.log('Uploading image to S3...');
    const s3Result = await s3Service.uploadImage(imageResult.imageData, imageParams);

    const responseData = {
      success: true,
      imageUrl: s3Result.publicUrl,
      s3_url: s3Result.publicUrl,
      presigned_url: s3Result.publicUrl,
      model: imageParams.model,
      metadata: {
        width: imageParams.width,
        height: imageParams.height,
        model: imageParams.model,
        s3Key: s3Result.key,
        timestamp: new Date().toISOString()
      }
    };

    console.log('Image generated and uploaded successfully');

    return createSuccessResponse(responseData, 'Image generated successfully');

  } catch (error) {
    console.error('Error in image generation handler:', error);

    // Handle specific AWS/Bedrock errors
    if (error.message.includes('Bedrock')) {
      return createErrorResponse(502, 'AI Service Error', 'Unable to connect to Bedrock image generation service');
    }

    // Handle timeout errors
    if (error.code === 'TimeoutError' || error.message.includes('timeout')) {
      return createErrorResponse(504, 'Request Timeout', 'Image generation took too long to complete');
    }

    // Handle rate limiting
    if (error.code === 'ThrottlingException') {
      return createErrorResponse(429, 'Rate Limit Exceeded', 'Too many requests, please try again later');
    }

    // Handle S3 errors
    if (error.message.includes('S3')) {
      return createErrorResponse(503, 'Storage Error', 'Unable to store generated image');
    }

    // Generic error response
    return createErrorResponse(500, 'Internal Server Error', 'An unexpected error occurred during image generation');
  }
}

// Health check handler
async function healthCheckHandler(event, context) {
  console.log('Health check requested for image generation service');

  // Initialize services
  initializeServices();

  try {
    // Test Bedrock connection
    const bedrockTest = await bedrockImageService.testConnection();

    // Test S3 connection
    const s3Test = await s3Service.testConnection();

    const allHealthy = bedrockTest.success && s3Test.success;

    if (allHealthy) {
      return createSuccessResponse({
        status: 'healthy',
        services: {
          bedrock: bedrockTest.success ? 'connected' : 'disconnected',
          s3: s3Test.success ? 'connected' : 'disconnected'
        },
        environment: {
          region: process.env.BEDROCK_REGION || 'us-east-1',
          s3Bucket: process.env.S3_BUCKET || 'formula-platform-generated-images',
          hasCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
        }
      }, 'Image generation service is healthy');
    } else {
      return createErrorResponse(503, 'Service Unhealthy', {
        services: {
          bedrock: bedrockTest.success ? 'connected' : 'disconnected',
          s3: s3Test.success ? 'connected' : 'disconnected'
        },
        errors: {
          bedrock: bedrockTest.error,
          s3: s3Test.error
        }
      });
    }
  } catch (error) {
    console.error('Health check failed:', error);
    return createErrorResponse(503, 'Service Unhealthy', error.message);
  }
}

module.exports = {
  generateImageHandler,
  healthCheckHandler
};