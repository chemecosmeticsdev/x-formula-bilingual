const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

class BedrockImageService {
  constructor() {
    const clientConfig = {
      region: process.env.BEDROCK_REGION || 'us-east-1',
    };

    // Only add explicit credentials if running locally (not in Lambda)
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
      clientConfig.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      };
    }

    this.client = new BedrockRuntimeClient(clientConfig);
  }

  async generateImage(params) {
    try {
      const { prompt, model, width, height, quality, cfg_scale, seed } = params;

      let payload;

      if (model === 'amazon.nova-canvas-v1:0') {
        // Nova Canvas payload format
        payload = {
          taskType: "TEXT_IMAGE",
          textToImageParams: {
            text: prompt,
            negativeText: "blurry, low quality, distorted, watermark, text, logo",
            images: []
          },
          imageGenerationConfig: {
            numberOfImages: 1,
            height: height || 1024,
            width: width || 1024,
            cfgScale: cfg_scale || 8.0,
            seed: seed || Math.floor(Math.random() * 1000000),
            quality: quality || "premium"
          }
        };
      } else if (model === 'amazon.titan-image-generator-v1') {
        // Titan Image Generator payload format
        payload = {
          taskType: "TEXT_IMAGE",
          textToImageParams: {
            text: prompt,
            negativeText: "blurry, low quality, distorted, watermark, text, logo"
          },
          imageGenerationConfig: {
            numberOfImages: 1,
            height: height || 1024,
            width: width || 1024,
            cfgScale: cfg_scale || 8.0,
            seed: seed || Math.floor(Math.random() * 1000000),
            quality: quality || "premium"
          }
        };
      } else {
        throw new Error(`Unsupported model: ${model}`);
      }

      const command = new InvokeModelCommand({
        modelId: model,
        body: JSON.stringify(payload),
        contentType: 'application/json',
        accept: 'application/json'
      });

      console.log('Calling Bedrock with model:', model);
      console.log('Image parameters:', { width, height, quality, cfg_scale });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      console.log('Bedrock response received');

      // Handle different response formats
      let imageData = null;

      if (responseBody.images && responseBody.images.length > 0) {
        // Nova Canvas format
        imageData = responseBody.images[0];
      } else if (responseBody.artifacts && responseBody.artifacts.length > 0) {
        // Titan format
        imageData = responseBody.artifacts[0].base64;
      } else {
        console.log('Unexpected response format:', JSON.stringify(responseBody, null, 2));
        throw new Error('No image data found in Bedrock response');
      }

      if (!imageData) {
        throw new Error('No image data received from Bedrock');
      }

      return {
        success: true,
        imageData: imageData, // Base64 encoded image data
        model: model,
        metadata: {
          width: width || 1024,
          height: height || 1024,
          cfgScale: cfg_scale || 8.0,
          seed: seed
        }
      };

    } catch (error) {
      console.error('Error calling AWS Bedrock for image generation:', error);

      // Handle specific Bedrock errors
      if (error.name === 'ValidationException') {
        return {
          success: false,
          error: `Invalid parameters for ${params.model}: ${error.message}`
        };
      } else if (error.name === 'ThrottlingException') {
        return {
          success: false,
          error: 'Rate limit exceeded, please try again later'
        };
      } else if (error.name === 'ModelNotReadyException') {
        return {
          success: false,
          error: `Model ${params.model} is not ready, please try again later`
        };
      } else if (error.name === 'ServiceQuotaExceededException') {
        return {
          success: false,
          error: 'Service quota exceeded for image generation'
        };
      }

      return {
        success: false,
        error: `Bedrock image generation error: ${error.message}`
      };
    }
  }

  async testConnection() {
    try {
      // Test with a simple prompt using Nova Canvas
      const testParams = {
        prompt: "A simple test image: red apple on white background",
        model: 'amazon.nova-canvas-v1:0',
        width: 512,
        height: 512,
        quality: 'standard',
        cfg_scale: 7.0,
        seed: 12345
      };

      const result = await this.generateImage(testParams);

      if (result.success) {
        return { success: true, message: 'Bedrock image service connection successful' };
      } else {
        return { success: false, error: result.error };
      }

    } catch (error) {
      return {
        success: false,
        error: `Connection test failed: ${error.message}`
      };
    }
  }
}

module.exports = BedrockImageService;