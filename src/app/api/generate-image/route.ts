import { NextRequest, NextResponse } from 'next/server';

interface ImageGenerateRequest {
  productName: string;
  tonalStyling: string;
  productType: string;
}

interface ImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  let productName: string = '';
  let tonalStyling: string = '';
  let productType: string = '';

  try {
    const requestData: ImageGenerateRequest = await request.json();
    productName = requestData.productName;
    tonalStyling = requestData.tonalStyling;
    productType = requestData.productType;

    if (!productName?.trim() || !tonalStyling?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Product name and tonal styling are required' },
        { status: 400 }
      );
    }

    // Create two versions: detailed for Nova Canvas, concise for Titan
    const detailedPrompt = `Generate a premium cosmetic product packaging mockup with professional studio photography quality:

PRODUCT DETAILS:
- Product Name: ${productName}
- Product Type: ${productType || 'serum'}
- Packaging Style: ${tonalStyling}

VISUAL SPECIFICATIONS:
- Ultra-luxury cosmetic product packaging in professional product photography style
- Clean white studio background with soft gradient lighting
- Product positioned at elegant 3/4 angle showing depth and dimension
- High-end department store aesthetic with premium materials
- Sophisticated typography and minimalist design elements
- Photo-realistic rendering with professional studio lighting

MATERIALS & DESIGN:
- ${tonalStyling.includes('frosted') || tonalStyling.includes('glass') ? 'Frosted glass bottle' : 'Premium glass container'} with elegant proportions
- ${tonalStyling.includes('gold') || tonalStyling.includes('metallic') ? 'Metallic gold/silver accents' : 'Refined metallic details'} on cap and label
- Clean, modern label design with scientific yet approachable typography
- Subtle texture effects and premium material finishes
- Professional lighting with soft reflections and dimensional shadows

COMPOSITION & QUALITY:
- Professional product photography composition
- Soft drop shadow for depth without distraction
- High-resolution, commercial-grade image quality
- Suitable for luxury brand marketing and e-commerce
- Color palette that conveys scientific innovation and premium quality

BRAND POSITIONING:
- Convey luxury, efficacy, and scientific sophistication
- Department store or premium beauty retailer presentation
- Medical-grade aesthetic combined with luxury appeal
- Professional, trustworthy, and innovative brand positioning

Create a stunning packaging mockup that would impress discerning customers and effectively communicate premium quality, scientific credibility, and luxury positioning.`;

    // Concise prompt for Titan (max 512 characters)
    const concisePrompt = `Premium ${productType || 'serum'} packaging mockup: "${productName}" with ${tonalStyling} styling. Professional product photography, luxury cosmetic bottle with elegant label, clean white background, studio lighting, ${tonalStyling.includes('gold') ? 'gold accents' : 'metallic details'}, high-end aesthetic, department store quality presentation.`;

    // Call AWS Bedrock Lambda endpoint for image generation
    const lambdaImageEndpoint = process.env.LAMBDA_BEDROCK_IMAGE_ENDPOINT;

    if (!lambdaImageEndpoint) {
      throw new Error('Lambda Bedrock image endpoint not configured');
    }

    console.log('Calling AWS Bedrock Lambda for image generation...');

    // Helper function to make Lambda calls with intelligent retry logic
    const makeLambdaCall = async (model: string, maxRetries = 2) => {
      // Choose appropriate prompt based on model
      const prompt = model.includes('titan') ? concisePrompt : detailedPrompt;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const response = await fetch(lambdaImageEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: prompt,
              model: model,
              width: 1024,
              height: 1024,
              quality: 'premium',
              cfg_scale: 8.0,
              seed: Math.floor(Math.random() * 1000000)
            }),
            signal: AbortSignal.timeout(60000) // 60 second timeout for Lambda
          });

          // If we get a response, check if it's a rate limit error
          if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            const isRateLimit = errorText.includes('Rate limit exceeded') || errorText.includes('rate limit');

            if (isRateLimit && attempt < maxRetries - 1) {
              // Exponential backoff for rate limit: 5s, 10s, 20s
              const waitTime = Math.min(5000 * Math.pow(2, attempt), 20000);
              console.log(`Rate limit hit for ${model}, waiting ${waitTime}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue; // Retry this attempt
            }
          }

          return response;
        } catch (error) {
          console.log(`Attempt ${attempt + 1} failed for ${model}:`, error);
          if (attempt === maxRetries - 1) throw error;
          // Wait 3 seconds before retry for network errors
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
      throw new Error('Max retries exceeded');
    };

    // Try Titan Image Generator first (more reliable)
    const imageResponse = await makeLambdaCall('amazon.titan-image-generator-v1', 1);

    console.log('Lambda image response status:', imageResponse.status);

    if (!imageResponse.ok) {
      // Log response details for debugging
      const errorText = await imageResponse.text().catch(() => 'Could not read response');
      const isRateLimit = errorText.includes('Rate limit exceeded') || errorText.includes('rate limit');

      console.log('Titan Image Generator failed with response:', errorText);

      if (isRateLimit) {
        console.log('Titan failed due to rate limiting, trying Nova Canvas as fallback...');
      } else {
        console.log('Titan failed due to service error, trying Nova Canvas as fallback...');
      }

      // If Titan fails, try Nova Canvas as fallback
      const novaResponse = await makeLambdaCall('amazon.nova-canvas-v1:0', 2);

      if (!novaResponse.ok) {
        const novaErrorText = await novaResponse.text().catch(() => 'Could not read response');
        const novaIsRateLimit = novaErrorText.includes('Rate limit exceeded') || novaErrorText.includes('rate limit');

        console.log('Nova Canvas also failed with response:', novaErrorText);

        if (isRateLimit && novaIsRateLimit) {
          throw new Error(`Both models failed due to rate limiting. Please try again in a few minutes.`);
        } else {
          throw new Error(`Both Titan and Nova Canvas failed. Status: ${imageResponse.status}, ${novaResponse.status}`);
        }
      }

      const novaData = await novaResponse.json();
      console.log('Nova Canvas response received:', JSON.stringify(novaData, null, 2));

      const result: ImageResponse = {
        success: true,
        imageUrl: novaData.imageUrl || novaData.image_url || novaData.s3_url || novaData.s3Url
      };

      return NextResponse.json(result);
    }

    const imageData = await imageResponse.json();
    console.log('Titan response received:', JSON.stringify(imageData, null, 2));

    // Handle different possible Lambda response formats
    let imageUrl = '';
    if (imageData.imageUrl) {
      imageUrl = imageData.imageUrl;
    } else if (imageData.image_url) {
      imageUrl = imageData.image_url;
    } else if (imageData.s3_url) {
      imageUrl = imageData.s3_url;
    } else if (imageData.s3Url) {
      imageUrl = imageData.s3Url;
    } else if (imageData.presigned_url) {
      imageUrl = imageData.presigned_url;
    } else if (imageData.artifacts && imageData.artifacts[0] && imageData.artifacts[0].s3Uri) {
      imageUrl = imageData.artifacts[0].s3Uri;
    } else {
      console.log('Unexpected response format from Titan:', imageData);
      throw new Error('No image URL found in Lambda response');
    }

    const result: ImageResponse = {
      success: true,
      imageUrl: imageUrl
    };

    console.log('Returning image URL:', imageUrl);
    return NextResponse.json(result);

  } catch (error) {
    console.error('AWS Bedrock Image Generation Error:', error);

    // Return a customized demo image that reflects the product details
    const customizedImageUrl = `/api/demo-image?product=${encodeURIComponent(productName)}&style=${encodeURIComponent(tonalStyling)}&type=${encodeURIComponent(productType || 'serum')}`;

    const fallbackResponse: ImageResponse = {
      success: true,
      imageUrl: customizedImageUrl
    };

    console.log('Falling back to demo image:', customizedImageUrl);
    return NextResponse.json(fallbackResponse);
  }
}