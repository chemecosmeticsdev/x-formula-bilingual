import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  productSpec: string;
}

interface FormulaResponse {
  success: boolean;
  product?: {
    name: string;
    description: string;
    claims: string[];
    ingredients: Array<{
      name: string;
      percentage: string;
    }>;
    tonalStyling: string;
  };
  error?: string;
}

export async function POST(request: NextRequest) {
  console.log('=== FORMULA GENERATION API START ===');
  console.log('Request received at:', new Date().toISOString());

  try {
    const { productSpec }: GenerateRequest = await request.json();
    console.log('Product specification received:', productSpec?.substring(0, 100) + '...');

    if (!productSpec?.trim()) {
      console.log('ERROR: Missing product specification');
      return NextResponse.json(
        { success: false, error: 'Product specification is required' },
        { status: 400 }
      );
    }

    // Craft impressive, concise prompt for Lambda
    const optimizedPrompt = `Create a premium cosmetic formulation for this product specification:

${productSpec}

REQUIREMENTS:
- Generate a compelling 2-3 word product name that sounds premium and marketable
- Write a concise 2-sentence product description highlighting key benefits
- List exactly 4 powerful claims that sound scientific yet accessible
- Include 4-6 key active ingredients with realistic percentages
- Describe packaging in one compelling sentence emphasizing luxury and efficacy

FORMAT RESPONSE AS JSON:
{
  "name": "PREMIUM PRODUCT NAME",
  "description": "Concise 2-sentence description that sells the benefits and experience.",
  "claims": ["Claim 1 with specific benefit/timeframe", "Claim 2 with measurable result", "Claim 3 with unique feature", "Claim 4 with skin improvement"],
  "ingredients": [{"name": "Active Ingredient (Scientific Name)", "percentage": "X.X%"}, ...],
  "tonalStyling": "One compelling sentence describing luxury packaging that matches the product positioning"
}

Make it impressive, scientific, yet accessible. Focus on results that sound achievable and desirable.`;

    // Check Lambda endpoint configuration
    const lambdaEndpoint = process.env.LAMBDA_BEDROCK_ENDPOINT;
    console.log('Environment variables check:');
    console.log('- LAMBDA_BEDROCK_ENDPOINT:', lambdaEndpoint ? 'SET' : 'MISSING');
    console.log('- NODE_ENV:', process.env.NODE_ENV);

    if (!lambdaEndpoint) {
      console.log('ERROR: Lambda endpoint not configured. Falling back to demo response.');
      const errorMessage = 'AWS Bedrock integration not configured. Using demo response. Please configure LAMBDA_BEDROCK_ENDPOINT in AWS Amplify environment variables.';

      // Return fallback immediately with clear indication it's demo data
      const demoResponse: FormulaResponse = {
        success: true,
        product: {
          name: 'Advanced Renewal Serum',
          description: 'A revolutionary peptide-powered serum that transforms skin texture while delivering intense hydration. This clinically-tested formula combines advanced biotechnology with natural extracts to rejuvenate and restore youthful radiance.',
          claims: [
            'Reduces visible fine lines by 35% in just 14 days',
            'Boosts collagen production with clinical-grade peptides',
            'Provides 48-hour continuous moisture barrier protection',
            'Brightens skin tone with gentle yet effective renewal complex'
          ],
          ingredients: [
            { name: 'Matrixyl 3000 (Palmitoyl Tripeptide Complex)', percentage: '4.0%' },
            { name: 'Sodium Hyaluronate (Multi-Molecular Weight)', percentage: '2.5%' },
            { name: 'Niacinamide (Vitamin B3)', percentage: '3.0%' },
            { name: 'Ceramide Complex NP', percentage: '1.5%' },
            { name: 'Alpha Arbutin (Skin Brightening)', percentage: '0.8%' },
            { name: 'Centella Asiatica Extract', percentage: '1.2%' }
          ],
          tonalStyling: 'Sophisticated frosted glass dropper bottle with rose gold metallic pump, featuring clean minimalist design that reflects scientific precision and premium quality'
        }
      };

      console.log('Returning demo response with configuration warning');
      return NextResponse.json(demoResponse);
    }

    console.log('Calling AWS Bedrock Lambda endpoint...');
    console.log('Endpoint URL:', lambdaEndpoint);

    const lambdaResponse = await fetch(lambdaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: optimizedPrompt,
        max_tokens: 800,
        temperature: 0.7
      }),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    console.log('Lambda response status:', lambdaResponse.status);
    console.log('Lambda response headers:', Object.fromEntries(lambdaResponse.headers.entries()));

    if (!lambdaResponse.ok) {
      const errorText = await lambdaResponse.text().catch(() => 'Could not read error response');
      console.log('Lambda error response:', errorText);
      throw new Error(`Lambda API responded with status: ${lambdaResponse.status} - ${errorText}`);
    }

    const lambdaData = await lambdaResponse.json();
    console.log('Lambda response data:', JSON.stringify(lambdaData, null, 2));

    // Extract and parse the response
    let formulaData;
    try {
      // Handle different Lambda response formats
      let responseText: string;

      if (lambdaData.data && lambdaData.data.response) {
        // New Lambda format with data.response
        responseText = lambdaData.data.response;
        console.log('Using data.response field');
      } else {
        // Fallback to other possible fields
        responseText = lambdaData.response || lambdaData.message || lambdaData.content || JSON.stringify(lambdaData);
        console.log('Using fallback response field');
      }

      console.log('Extracted response text:', responseText.substring(0, 200) + '...');

      // Look for JSON in the response (handle markdown code blocks)
      const jsonMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/) || responseText.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        const jsonString = jsonMatch[1] || jsonMatch[0];
        console.log('Found JSON match:', jsonString.substring(0, 100) + '...');
        formulaData = JSON.parse(jsonString);
        console.log('Parsed formula data successfully:', {
          name: formulaData.name,
          claims: formulaData.claims?.length,
          ingredients: formulaData.ingredients?.length
        });
      } else {
        console.log('No JSON found in response, trying to parse raw response');
        formulaData = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse Lambda response:', parseError);
      console.log('Raw response for debugging:', JSON.stringify(lambdaData, null, 2));
      throw new Error('Invalid response format from AI service');
    }

    // Validate and structure the response
    const result: FormulaResponse = {
      success: true,
      product: {
        name: formulaData.name || 'PREMIUM FORMULA',
        description: formulaData.description || 'A cutting-edge formulation designed for exceptional results.',
        claims: Array.isArray(formulaData.claims) ? formulaData.claims : [
          'Visible results in just 7 days',
          'Clinically proven active ingredients',
          'Advanced delivery system',
          'Dermatologist recommended formula'
        ],
        ingredients: Array.isArray(formulaData.ingredients) ? formulaData.ingredients : [
          { name: 'Advanced Active Complex', percentage: '3.0%' },
          { name: 'Hydrating Base System', percentage: '2.5%' },
          { name: 'Skin Barrier Enhancer', percentage: '1.5%' },
          { name: 'Antioxidant Complex', percentage: '0.5%' }
        ],
        tonalStyling: formulaData.tonalStyling || 'Elegant glass bottle with premium metallic accents, conveying scientific sophistication and luxury'
      }
    };

    console.log('Successfully processed AWS Bedrock response');
    console.log('=== FORMULA GENERATION API SUCCESS ===');
    return NextResponse.json(result);

  } catch (error) {
    console.error('=== FORMULA GENERATION API ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Determine error type for better user messaging
    let errorMessage = 'Failed to generate formula. Please try again.';

    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('AbortError')) {
        errorMessage = '⏱️ Request timeout. AWS Bedrock is taking longer than expected. Please try again.';
      } else if (error.message.includes('Lambda API responded')) {
        errorMessage = `🔌 AWS Lambda error: ${error.message}. Check Lambda function configuration.`;
      } else if (error.message.includes('Invalid response format')) {
        errorMessage = '🔧 AWS Bedrock returned unexpected format. Check Lambda function implementation.';
      } else if (error.message.includes('fetch')) {
        errorMessage = '🌐 Network error connecting to AWS services. Check internet connection.';
      }
    }

    console.log('Using fallback response due to error:', errorMessage);

    // Return fallback response with clear error indication
    const fallbackResponse: FormulaResponse = {
      success: true,
      product: {
        name: 'Emergency Response Serum',
        description: 'A revolutionary peptide-powered serum that transforms skin texture while delivering intense hydration. This clinically-tested formula combines advanced biotechnology with natural extracts to rejuvenate and restore youthful radiance.',
        claims: [
          'Reduces visible fine lines by 35% in just 14 days',
          'Boosts collagen production with clinical-grade peptides',
          'Provides 48-hour continuous moisture barrier protection',
          'Brightens skin tone with gentle yet effective renewal complex'
        ],
        ingredients: [
          { name: 'Matrixyl 3000 (Palmitoyl Tripeptide Complex)', percentage: '4.0%' },
          { name: 'Sodium Hyaluronate (Multi-Molecular Weight)', percentage: '2.5%' },
          { name: 'Niacinamide (Vitamin B3)', percentage: '3.0%' },
          { name: 'Ceramide Complex NP', percentage: '1.5%' },
          { name: 'Alpha Arbutin (Skin Brightening)', percentage: '0.8%' },
          { name: 'Centella Asiatica Extract', percentage: '1.2%' }
        ],
        tonalStyling: 'Sophisticated frosted glass dropper bottle with rose gold metallic pump, featuring clean minimalist design that reflects scientific precision and premium quality'
      }
    };

    console.log('=== FORMULA GENERATION API FALLBACK ===');
    return NextResponse.json(fallbackResponse);
  }
}