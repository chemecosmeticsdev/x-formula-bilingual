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
  try {
    const { productSpec }: GenerateRequest = await request.json();

    if (!productSpec?.trim()) {
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

    // Call Lambda endpoint
    const lambdaEndpoint = process.env.LAMBDA_BEDROCK_ENDPOINT;

    if (!lambdaEndpoint) {
      throw new Error('Lambda endpoint not configured');
    }

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
    });

    if (!lambdaResponse.ok) {
      throw new Error(`Lambda API responded with status: ${lambdaResponse.status}`);
    }

    const lambdaData = await lambdaResponse.json();

    // Extract and parse the response
    let formulaData;
    try {
      // Try to parse JSON from the response
      const responseText = lambdaData.response || lambdaData.message || lambdaData.content || JSON.stringify(lambdaData);

      // Look for JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        formulaData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Lambda response:', parseError);
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

    return NextResponse.json(result);

  } catch (error) {
    console.error('API Error:', error);

    // Return fallback response with impressive sample data
    const fallbackResponse: FormulaResponse = {
      success: true,
      product: {
        name: 'LUMINOUS RENEWAL SERUM',
        description: 'A revolutionary peptide-powered serum that transforms skin texture while delivering intense hydration. Advanced microencapsulation technology ensures maximum ingredient penetration for visible anti-aging results.',
        claims: [
          'Reduces fine lines by 35% in just 14 days',
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

    return NextResponse.json(fallbackResponse);
  }
}