# Formula Platform - Image Generation Lambda

AWS Lambda function for generating product packaging images using AWS Bedrock (Nova Canvas and Titan Image Generator).

## ⏰ **Key Timeout Configuration**

This Lambda function is specifically configured with extended timeouts to accommodate image generation:

- **Lambda Timeout**: 120 seconds (2 minutes)
- **Memory**: 1024 MB
- **API Gateway Timeout**: 45 seconds for individual requests

## 🚀 Features

- **AWS Bedrock Integration**: Nova Canvas (primary) and Titan Image Generator (fallback)
- **S3 Storage**: Automatic upload and public URL generation
- **Extended Timeouts**: Properly configured for image generation workloads
- **Error Handling**: Comprehensive error handling with fallback mechanisms
- **CORS Support**: Full CORS configuration for web applications

## 📋 Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 18+
- Serverless Framework
- AWS Bedrock access to Nova Canvas and Titan models

## 🔧 Setup

1. **Clone and navigate:**
   ```bash
   cd lambda/image-generation
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your AWS credentials and configuration
   ```

4. **Deploy:**
   ```bash
   ./deploy.sh dev
   ```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS Access Key (local dev only) | - |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key (local dev only) | - |
| `AWS_REGION` | AWS Region | `ap-southeast-1` |
| `BEDROCK_REGION` | Bedrock Region | `us-east-1` |
| `S3_BUCKET` | S3 bucket for generated images | `formula-platform-generated-images` |

## 🔗 Integration

Update your main application's `.env.local`:

```bash
LAMBDA_BEDROCK_IMAGE_ENDPOINT=https://your-api-gateway-url/dev/generate-image
```
