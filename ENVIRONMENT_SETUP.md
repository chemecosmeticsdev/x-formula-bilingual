# AWS Amplify Environment Variables Setup Guide

This document provides detailed instructions for configuring the necessary environment variables in AWS Amplify to enable full AI-powered functionality for the X Formula Platform.

## 🔧 Required Environment Variables

The following environment variables must be configured in the AWS Amplify Console under **App Settings > Environment Variables** for the application to connect to AWS Bedrock services:

### Core AWS Bedrock Configuration

| Variable Name | Required | Description | Example Value |
|---------------|----------|-------------|---------------|
| `LAMBDA_BEDROCK_ENDPOINT` | ✅ **Yes** | AWS Lambda Function URL for formula generation via AWS Bedrock | `https://abc123.lambda-url.us-east-1.on.aws/` |
| `LAMBDA_BEDROCK_IMAGE_ENDPOINT` | ✅ **Yes** | AWS Lambda Function URL for image generation via AWS Bedrock | `https://def456.lambda-url.us-east-1.on.aws/` |
| `BEDROCK_ACCESS_KEY_ID` | ✅ **Yes** | AWS Access Key ID with Bedrock permissions | `AKIAI44QH8DHBEXAMPLE` |
| `BEDROCK_SECRET_ACCESS_KEY` | ✅ **Yes** | AWS Secret Access Key for Bedrock access | `je7MtGbClwBF/2Zp9Utk/h3yCo8nvbEXAMPLEKEY` |
| `BEDROCK_REGION` | ✅ **Yes** | AWS Region where Bedrock is available | `us-east-1` |

### Optional Configuration

| Variable Name | Required | Description | Default Value |
|---------------|----------|-------------|---------------|
| `NODE_ENV` | ❌ No | Environment indicator | `production` |
| `NEXT_PUBLIC_APP_NAME` | ❌ No | Application name shown to users | `X Formula Platform` |

## 🚀 Setup Instructions

### Step 1: Access AWS Amplify Console
1. Log in to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your **X Formula Platform** application
3. Navigate to **App settings** → **Environment variables**

### Step 2: Add Environment Variables
Click **Manage variables** and add each required variable:

```bash
# Formula Generation Endpoint
LAMBDA_BEDROCK_ENDPOINT = https://your-formula-lambda.lambda-url.region.on.aws/

# Image Generation Endpoint
LAMBDA_BEDROCK_IMAGE_ENDPOINT = https://your-image-lambda.lambda-url.region.on.aws/

# AWS Credentials with Bedrock Permissions
BEDROCK_ACCESS_KEY_ID = YOUR_ACCESS_KEY_HERE
BEDROCK_SECRET_ACCESS_KEY = YOUR_SECRET_KEY_HERE
BEDROCK_REGION = us-east-1
```

### Step 3: Save and Redeploy
1. Click **Save** to apply the changes
2. AWS Amplify will automatically trigger a new deployment
3. Wait for the deployment to complete (usually 2-5 minutes)

## 🛠️ AWS Lambda Functions Setup

The application requires two Lambda functions to be deployed in your AWS account:

### Formula Generation Lambda
- **Purpose**: Connects to AWS Bedrock Claude for cosmetic formula generation
- **Runtime**: Python 3.9+ or Node.js 18+
- **Permissions**: `bedrock:InvokeModel`
- **Models Used**: Claude 3.5 Sonnet or similar
- **Expected Response**: JSON with formula data

### Image Generation Lambda
- **Purpose**: Connects to AWS Bedrock for packaging mockup generation
- **Runtime**: Python 3.9+ or Node.js 18+
- **Permissions**: `bedrock:InvokeModel`
- **Models Used**: Amazon Titan Image Generator v1, Amazon Nova Canvas
- **Expected Response**: S3 URL or base64 image data

## 🔍 Troubleshooting

### Issue: "Demo Response" Messages
**Symptoms**: Formula results show "✨ DEMO FORMULA ✨" or "🚧 This is demonstration data"

**Solution**:
- Verify `LAMBDA_BEDROCK_ENDPOINT` is set correctly
- Check Lambda function URL is accessible
- Ensure Lambda has proper IAM permissions

### Issue: Demo Images Only
**Symptoms**: Generated images are basic SVG mockups instead of AI-generated packaging

**Solution**:
- Verify `LAMBDA_BEDROCK_IMAGE_ENDPOINT` is set correctly
- Check Lambda function for image generation exists
- Ensure AWS Bedrock image models are available in your region

### Issue: API Timeout Errors
**Symptoms**: "Request timeout" or "AWS Bedrock is taking longer than expected"

**Solution**:
- Check Lambda function timeout settings (increase to 60+ seconds)
- Verify AWS Bedrock service availability in your region
- Monitor Lambda logs for performance issues

### Issue: Rate Limit Errors
**Symptoms**: "Rate limit exceeded" messages in logs

**Solution**:
- Check AWS Bedrock quotas in AWS Console
- Request quota increases if needed
- Implement exponential backoff (already built-in)

## 📊 Monitoring & Debugging

### Console Logging
The application provides comprehensive logging. To view logs in AWS Amplify:

1. Go to **Amplify Console** → **Your App** → **Monitoring**
2. Check **Function logs** for API debugging information
3. Look for these log patterns:

```
=== FORMULA GENERATION API START ===
Environment variables check:
- LAMBDA_BEDROCK_ENDPOINT: SET/MISSING

=== IMAGE GENERATION API START ===
Environment variables check:
- LAMBDA_BEDROCK_IMAGE_ENDPOINT: SET/MISSING
```

### Success Indicators
When properly configured, you should see:
- Real cosmetic formulas without "DEMO" or "FALLBACK" prefixes
- AI-generated packaging images instead of basic SVG mockups
- Fast response times (2-10 seconds for formula, 10-30 seconds for images)

## 🔐 Security Best Practices

1. **IAM Permissions**: Create a dedicated IAM user with minimal permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

2. **Key Rotation**: Regularly rotate AWS access keys
3. **Region Selection**: Use regions where Bedrock is available (us-east-1, us-west-2, etc.)
4. **Monitoring**: Enable CloudTrail logging for Bedrock API calls

## 🆘 Support

If you encounter issues:

1. Check the **Environment Variables** section in AWS Amplify Console
2. Verify Lambda functions are deployed and accessible
3. Review CloudWatch logs for detailed error messages
4. Ensure AWS Bedrock is available in your selected region

For additional support, check the application logs in AWS Amplify Console under **Monitoring** → **Function logs**.