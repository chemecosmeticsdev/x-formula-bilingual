#!/bin/bash

set -e

echo "🚀 Deploying Formula Platform Image Generation Lambda..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found. Please create it from .env.example"
    exit 1
fi

# Load environment variables
source .env.local

# Check required environment variables
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "❌ AWS credentials not found in .env.local"
    exit 1
fi

if [ -z "$S3_BUCKET" ]; then
    echo "❌ S3_BUCKET not configured in .env.local"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Checking S3 bucket..."
aws s3 ls s3://$S3_BUCKET > /dev/null 2>&1 || {
    echo "⚠️  S3 bucket $S3_BUCKET doesn't exist. Creating it..."
    aws s3 mb s3://$S3_BUCKET --region ${AWS_REGION:-ap-southeast-1}
    
    # Configure bucket for public read access
    echo "🔒 Configuring bucket permissions..."
    aws s3api put-public-access-block \
        --bucket $S3_BUCKET \
        --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
    
    # Add bucket policy for public read access to generated images
    cat > /tmp/bucket-policy.json << EOL
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$S3_BUCKET/generated-images/*"
        }
    ]
}
EOL
    
    aws s3api put-bucket-policy --bucket $S3_BUCKET --policy file:///tmp/bucket-policy.json
    rm /tmp/bucket-policy.json
}

echo "☁️  Deploying to AWS Lambda..."
stage=${1:-dev}
npx serverless deploy --stage $stage

echo "✅ Deployment completed!"
echo ""
echo "🔗 Endpoints:"
npx serverless info --stage $stage

echo ""
echo "🧪 Testing health endpoint..."
HEALTH_URL=$(npx serverless info --stage $stage | grep "GET - " | grep "/health" | awk '{print $3}')
if [ ! -z "$HEALTH_URL" ]; then
    curl -s "$HEALTH_URL" | jq '.' || echo "Health check endpoint: $HEALTH_URL"
else
    echo "Could not determine health endpoint URL"
fi

echo ""
echo "🎉 Lambda function deployed successfully!"
echo "Don't forget to update LAMBDA_BEDROCK_IMAGE_ENDPOINT in your main application's .env.local"
