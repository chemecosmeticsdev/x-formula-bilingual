"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
          // Detect product type from formula name and description
          const detectProductType = (name: string, description: string): string => {
            const combinedText = (name + ' ' + description).toLowerCase();

            if (combinedText.includes('face oil') || combinedText.includes('facial oil') || combinedText.includes('oil')) {
              return 'face oil';
            } else if (combinedText.includes('cleanser') || combinedText.includes('cleansing') || combinedText.includes('wash') || combinedText.includes('foam')) {
              return 'cleanser';
            } else if (combinedText.includes('moisturizer') || combinedText.includes('cream') || combinedText.includes('lotion')) {
              return 'moisturizer';
            } else if (combinedText.includes('mask') || combinedText.includes('treatment mask')) {
              return 'mask';
            } else if (combinedText.includes('toner') || combinedText.includes('essence') || combinedText.includes('mist')) {
              return 'toner';
            } else if (combinedText.includes('balm')) {
              return 'balm';
            } else {
              return 'serum'; // default fallback
            }
          };

          const detectedProductType = detectProductType(formulaData.product.name, formulaData.product.description);
          console.log('Detected product type:', detectedProductType);

          console.log('Calling image generation API...');
          const imageResponse = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productName: formulaData.product.name,
              tonalStyling: formulaData.product.tonalStyling,
              productType: detectedProductType
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
  }, [t, locale, router]);

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
        <header className="w-full border-b bg-white">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${locale}`} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <span className="mr-2">←</span>
              <span>{t('common.back', { fallback: 'Back to Home' })}</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t('homepage.title', { fallback: 'X FORMULA PLATFORM' })}</h1>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button variant="outline" className="text-gray-600 flex items-center gap-2 text-sm">
                <span>📥</span>
                <span>Download</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">

          {/* Status Badge */}
          <div className="text-center mb-8">
            <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 text-sm font-medium rounded-full">
              ✓ {t('result.generatedConcept', { fallback: 'Generated Concept' })}
            </Badge>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">

            {/* Product Title */}
            <div className="text-center px-8 py-8 bg-white">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {result.product.name}
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {result.product.description}
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="px-8 pb-8">
              <div className="flex flex-col lg:flex-row gap-12">

                {/* Left Side - Product Image */}
                <div className="lg:w-2/5">
                  <div className="bg-gray-50 rounded-2xl p-8 text-center">
                    <div className="relative w-full max-w-sm mx-auto">
                      <div className="w-full aspect-square bg-gradient-to-br from-white to-gray-100 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden border border-gray-200">
                        {result.imageUrl && !imageError ? (
                          <img
                            src={result.imageUrl}
                            alt={`${result.product.name} packaging mockup`}
                            className="w-full h-full object-contain p-4"
                            onLoad={() => {
                              console.log('Image loaded successfully:', result.imageUrl);
                              setImageLoaded(true);
                            }}
                            onError={() => {
                              console.log('Image failed to load:', result.imageUrl);
                              setImageError(true);
                            }}
                          />
                        ) : (
                          <div className="text-center p-6">
                            <div className="text-6xl font-bold text-blue-600 mb-3">
                              {result.product.name.split(' ').map(word => word[0]).join('').substring(0, 2)}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {t('result.aiGeneratedMockup', { fallback: 'AI-Generated Mockup' })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-gray-700 font-semibold text-lg">
                        {result.product.name}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {t('result.aiGeneratedMockup', { fallback: 'AI-Generated Mockup' })}
                      </p>
                    </div>
                  </div>

                  {/* Tonal Styling */}
                  <div className="mt-8 bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">🎨</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                          {t('result.product.tonalStyling', { fallback: 'Tonal Styling' })}:
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {result.product.tonalStyling}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Product Details */}
                <div className="lg:w-3/5">

                  {/* Key Claims */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {t('result.product.claims', { fallback: 'Key Claims' })}
                    </h2>
                    <div className="space-y-4">
                      {result.product.claims.map((claim, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-gray-700 leading-relaxed">{claim}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Ingredients */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {t('result.product.ingredients', { fallback: 'Key Ingredients' })}
                    </h2>
                    <div className="space-y-3">
                      {result.product.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex justify-between items-start py-3 border-b border-gray-200 last:border-b-0">
                          <div className="flex-1 pr-4">
                            <span className="font-semibold text-gray-900">{ingredient.name.split('(')[0].trim()}</span>
                            {ingredient.name.includes('(') && (
                              <div className="text-sm text-gray-500 mt-1">
                                INCI: {ingredient.name.split('(')[1]?.replace(')', '')}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-gray-800 text-lg">{ingredient.percentage}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base rounded-lg font-semibold min-w-[200px]">
                {t('result.requestFullFormula', { fallback: 'Request Full Formula' })}
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base rounded-lg font-semibold min-w-[200px]">
                {t('result.orderPrototype', { fallback: 'Order Prototype' })}
              </Button>
            </div>

            <div>
              <Button variant="ghost" className="text-gray-600 hover:text-pink-600 flex items-center gap-2 mx-auto">
                <span className="text-lg">♡</span>
                <span>{t('result.addToWishlist', { fallback: 'Add to Wishlist' })}</span>
              </Button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Link href={`/${locale}/generate`}>
                <Button variant="outline" className="px-8 py-3 text-base border-2 border-gray-300 hover:border-gray-400 rounded-lg font-medium">
                  {t('result.actions.generateNew', { fallback: 'Generate Another Formula' })}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}