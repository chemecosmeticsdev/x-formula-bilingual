"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface FormulaResult {
  success: boolean;
  product: {
    name: string;
    description: string;
    claims: string[];
    ingredients: Array<{
      name: string;
      percentage: string;
    }>;
    tonalStyling: string;
  };
  imageUrl?: string;
  error?: string;
}

// Force dynamic rendering due to useSearchParams and sessionStorage usage
export const dynamic = 'force-dynamic';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const t = useTranslations();
  const [result, setResult] = useState<FormulaResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const generateFormula = async () => {
      try {
        // Get product specification from session storage
        const productSpec = typeof window !== 'undefined'
          ? sessionStorage.getItem('productSpec')
          : null;

        if (!productSpec) {
          // Redirect to generate page if no product spec is found
          console.log('No product specification found, redirecting to generate page');
          router.push(`/${locale}/generate`);
          return;
        }

        // Call formula generation API
        const formulaResponse = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productSpec }),
        });

        if (!formulaResponse.ok) {
          throw new Error(`API responded with status: ${formulaResponse.status}`);
        }

        const formulaData = await formulaResponse.json();

        if (!formulaData.success) {
          throw new Error(formulaData.error || 'Formula generation failed');
        }

        // Generate product image (parallel to formula generation)
        let imageUrl: string | undefined;
        try {
          console.log('Calling image generation API...');
          const imageResponse = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productName: formulaData.product.name,
              tonalStyling: formulaData.product.tonalStyling,
              productType: 'serum'
            }),
          });

          console.log('Image API response status:', imageResponse.status);

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            console.log('Image API response data:', imageData);

            if (imageData.success && imageData.imageUrl) {
              imageUrl = imageData.imageUrl;
              console.log('Image URL set to:', imageUrl);
            } else {
              console.log('No imageUrl in response or success=false');
            }
          } else {
            console.log('Image API response not OK:', imageResponse.status);
          }
        } catch (imageError) {
          console.log('Image generation failed with error:', imageError);
        }

        const result: FormulaResult = {
          ...formulaData,
          imageUrl
        };

        setResult(result);

        // Reset image state for new result
        setImageLoaded(false);
        setImageError(false);

        // Clear the session storage
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('productSpec');
        }

      } catch (error) {
        console.error("API Error:", error);
        setResult({
          success: false,
          error: t('errors.serverError', { fallback: "Unable to connect to formula generation service. Please check your credentials and try again." }),
          product: {
            name: "",
            description: "",
            claims: [],
            ingredients: [],
            tonalStyling: ""
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateFormula();
  }, [t]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <h2 className="text-xl font-semibold text-gray-700">
            {t('result.generating', { fallback: 'Generating Your Complete Kit...' })}
          </h2>
          <p className="text-gray-500 mt-2">
            {t('result.generatingSubtitle', { fallback: 'Creating your personalized cosmetic formulation and packaging mockup' })}
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-pulse"></div>
              {t('result.formulaGeneration', { fallback: 'Formula Generation' })}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              {t('result.packagingDesign', { fallback: 'Packaging Design' })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href={`/${locale}`}>
                <Button variant="ghost" className="text-gray-600 hover:text-teal-600">
                  ← {t('common.back')}
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{t('homepage.title')}</h1>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Error Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-red-800 mb-4">
                {t('result.generationFailed', { fallback: 'Generation Failed' })}
              </h2>
              <p className="text-red-600 mb-6">{result?.error}</p>
              <div className="flex gap-4 justify-center">
                <Link href={`/${locale}/generate`}>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    {t('common.tryAgain')}
                  </Button>
                </Link>
                <Link href={`/${locale}`}>
                  <Button variant="outline">
                    {t('common.back')} {t('navigation.home')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${locale}`}>
              <Button variant="ghost" className="text-gray-600 hover:text-teal-600">
                ← {t('common.back')} {t('navigation.home')}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t('homepage.title')}</h1>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button variant="outline" className="text-gray-600">
                📥 {t('result.actions.downloadPdf')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Result Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Status Badge */}
          <div className="text-center mb-8">
            <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm">
              ✓ {t('result.generatedConcept', { fallback: 'Generated Concept' })}
            </Badge>
          </div>

          {/* Product Name */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {result.product.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {result.product.description}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Left Column - Product Visual */}
            <div className="flex flex-col items-center">
              {/* Product Packaging Mockup */}
              <div className="mb-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('result.packaging.title')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('result.aiGeneratedMockup', { fallback: 'AI-Generated Mockup' })}
                  </p>
                </div>
                <div className="w-full max-w-sm h-80 rounded-xl overflow-hidden shadow-xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 relative">
                  {result.imageUrl && !imageError ? (
                    <img
                      src={result.imageUrl}
                      alt={`${result.product.name} packaging mockup`}
                      className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${imageLoaded ? 'block' : 'hidden'}`}
                      onLoad={() => {
                        console.log('Image loaded successfully:', result.imageUrl);
                        setImageLoaded(true);
                      }}
                      onError={(e) => {
                        console.log('Image failed to load:', result.imageUrl);
                        setImageError(true);
                      }}
                    />
                  ) : null}

                  {/* Fallback content - show when no image URL, image hasn't loaded, or image failed */}
                  <div className={`w-full h-full flex items-center justify-center bg-white absolute inset-0 ${imageLoaded && !imageError ? 'hidden' : 'block'}`}>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-600 mb-3">
                        {result.product.name.split(' ').map(word => word[0]).join('').substring(0, 2)}
                      </div>
                      <div className="text-sm text-gray-600 font-medium px-6 max-w-48 leading-tight">
                        {result.product.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tonal Styling */}
              <Card className="w-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🎨</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {t('result.product.tonalStyling')}:
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {result.product.tonalStyling}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-8">
              {/* Key Claims */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {t('result.product.claims')}
                </h2>
                <div className="space-y-3">
                  {result.product.claims.map((claim, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Badge className="bg-green-100 text-green-800 border-green-200 mt-1 flex-shrink-0">
                        ✓
                      </Badge>
                      <span className="text-gray-700">{claim}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Ingredients */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {t('result.product.ingredients')}
                </h2>
                <div className="space-y-4">
                  {result.product.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900 flex-1">{ingredient.name}</span>
                      <span className="font-bold text-gray-700 ml-4">{ingredient.percentage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
              {t('result.requestFullFormula', { fallback: 'Request Full Formula' })}
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
              {t('result.orderPrototype', { fallback: 'Order Prototype' })}
            </Button>
          </div>

          <div className="text-center mt-6">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
              🤍 {t('result.addToWishlist', { fallback: 'Add to Wishlist' })}
            </Button>
          </div>

          {/* Generate Another */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <Link href={`/${locale}/generate`}>
              <Button variant="outline" className="px-8 py-3 text-lg">
                {t('result.actions.generateNew')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}