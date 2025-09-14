const { S3Client, PutObjectCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');

class S3Service {
  constructor() {
    const clientConfig = {
      region: process.env.AWS_REGION || 'ap-southeast-1',
    };

    // Only add explicit credentials if running locally (not in Lambda)
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
      clientConfig.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      };
    }

    this.client = new S3Client(clientConfig);
    this.bucket = process.env.S3_BUCKET || 'formula-platform-generated-images';
  }

  async uploadImage(imageData, params) {
    try {
      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const randomId = crypto.randomUUID().slice(0, 8);
      const filename = `generated-images/${timestamp}-${randomId}.png`;

      // Convert base64 to buffer if needed
      let buffer;
      if (typeof imageData === 'string') {
        // Remove data URL prefix if present
        const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
        buffer = Buffer.from(base64Data, 'base64');
      } else if (Buffer.isBuffer(imageData)) {
        buffer = imageData;
      } else {
        throw new Error('Invalid image data format');
      }

      console.log(`Uploading image to S3: ${this.bucket}/${filename}`);

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: buffer,
        ContentType: 'image/png',
        CacheControl: 'public, max-age=31536000', // 1 year cache
        Metadata: {
          'generated-by': 'formula-platform',
          'model': params.model || 'unknown',
          'timestamp': new Date().toISOString(),
          'width': String(params.width || 1024),
          'height': String(params.height || 1024)
        }
      });

      await this.client.send(command);

      // Construct public URL
      const publicUrl = `https://${this.bucket}.s3.${process.env.AWS_REGION || 'ap-southeast-1'}.amazonaws.com/${filename}`;

      console.log('Image uploaded successfully:', publicUrl);

      return {
        success: true,
        key: filename,
        publicUrl: publicUrl,
        bucket: this.bucket
      };

    } catch (error) {
      console.error('Error uploading image to S3:', error);

      // Handle specific S3 errors
      if (error.name === 'NoSuchBucket') {
        throw new Error(`S3 bucket ${this.bucket} does not exist`);
      } else if (error.name === 'AccessDenied') {
        throw new Error('Access denied to S3 bucket. Check IAM permissions.');
      } else if (error.name === 'InvalidBucketName') {
        throw new Error(`Invalid S3 bucket name: ${this.bucket}`);
      }

      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  async testConnection() {
    try {
      console.log(`Testing S3 connection to bucket: ${this.bucket}`);

      const command = new HeadBucketCommand({
        Bucket: this.bucket
      });

      await this.client.send(command);

      return {
        success: true,
        message: `Successfully connected to S3 bucket: ${this.bucket}`
      };

    } catch (error) {
      console.error('S3 connection test failed:', error);

      if (error.name === 'NoSuchBucket') {
        return {
          success: false,
          error: `S3 bucket ${this.bucket} does not exist`
        };
      } else if (error.name === 'Forbidden' || error.name === 'AccessDenied') {
        return {
          success: false,
          error: 'Access denied to S3 bucket. Check IAM permissions.'
        };
      }

      return {
        success: false,
        error: `S3 connection failed: ${error.message}`
      };
    }
  }
}

module.exports = S3Service;