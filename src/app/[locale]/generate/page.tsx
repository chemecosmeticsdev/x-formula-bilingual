"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function GeneratePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  const [productSpec, setProductSpec] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    productSpec: string;
    status: string;
  } | null>(null);

  const exampleSpecs = [
    {
      title: t('generate.examples.antiAging.title', { fallback: 'Anti-Aging Serum' }),
      description: t('generate.examples.antiAging.description', {
        fallback: 'A premium anti-aging serum targeting fine lines and wrinkles for women 35-50. Should contain retinol or retinol alternatives, hyaluronic acid for hydration, and peptides for skin firmness. Lightweight texture that absorbs quickly. Clean, clinical packaging preferred.'
      }),
      category: t('generate.examples.antiAging.category', { fallback: 'Skincare' })
    },
    {
      title: t('generate.examples.cleanser.title', { fallback: 'Natural Face Cleanser' }),
      description: t('generate.examples.cleanser.description', {
        fallback: 'Gentle foam cleanser for sensitive skin with 100% natural ingredients only. Should remove makeup and impurities without stripping the skin. Include soothing botanicals like chamomile or aloe vera. pH balanced formula. Eco-friendly packaging.'
      }),
      category: t('generate.examples.cleanser.category', { fallback: 'Cleansing' })
    },
    {
      title: t('generate.examples.moisturizer.title', { fallback: 'Hydrating Moisturizer' }),
      description: t('generate.examples.moisturizer.description', {
        fallback: '24-hour moisture lock formula for dry and dehydrated skin. Should contain ceramides for barrier repair, niacinamide for pore refinement, and squalane for deep hydration. Non-greasy finish suitable for day and night use.'
      }),
      category: t('generate.examples.moisturizer.category', { fallback: 'Moisturizing' })
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productSpec.trim()) return;

    setIsLoading(true);

    // Store the product spec in session storage for the result page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('productSpec', productSpec.trim());
    }

    try {
      // Simulate API delay before navigating
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to result page with locale
      router.push(`/${locale}/result`);
    } catch (error) {
      console.error("Error generating formula:", error);
      setResult({
        message: t('generate.errors.failed'),
        productSpec: productSpec.trim(),
        status: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const useExample = (spec: string) => {
    setProductSpec(spec);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href={`/${locale}`}>
                <h1 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                  {t('homepage.title', { fallback: 'X FORMULA PLATFORM' })}
                </h1>
              </Link>
              <span className="ml-2 text-sm text-gray-500">v2.0</span>
            </div>
            <nav className="flex items-center space-x-8">
              <div className="hidden md:flex items-center space-x-8">
                <Link href={`/${locale}#features`} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  {t('navigation.features', { fallback: 'Features' })}
                </Link>
                <Link href={`/${locale}#how-it-works`} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  {t('navigation.howItWorks', { fallback: 'How It Works' })}
                </Link>
                <Link href={`/${locale}#testimonials`} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  {t('navigation.about', { fallback: 'About' })}
                </Link>
              </div>
              <LanguageSwitcher />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('generate.title', { fallback: 'Generate Your Formula' })}
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('generate.subtitle', { fallback: 'Describe your cosmetic product and let AI create the perfect formulation' })}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 border">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('generate.form.productDescription.label', { fallback: 'Product Description' })}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t('generate.form.description', {
                      fallback: 'Provide detailed information about your desired cosmetic product. Be specific about target audience, key benefits, preferred ingredients, and packaging preferences.'
                    })}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="productSpec" className="text-lg font-semibold text-gray-900">
                      {t('generate.form.productDescription.label', { fallback: 'Product Description' })}
                    </Label>
                    <Textarea
                      id="productSpec"
                      placeholder={t('generate.form.productDescription.placeholder', {
                        fallback: 'Describe your cosmetic product (e.g., anti-aging serum with hyaluronic acid and peptides for mature skin)'
                      })}
                      value={productSpec}
                      onChange={(e) => setProductSpec(e.target.value)}
                      rows={10}
                      className="min-h-[250px] text-lg p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-0"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={!productSpec.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-1"
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          {t('generate.form.generating', { fallback: 'Generating your formula...' })}
                        </>
                      ) : (
                        t('generate.form.submit', { fallback: 'Generate Formula' })
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setProductSpec("")}
                      disabled={!productSpec.trim()}
                      className="px-8 py-4 rounded-full font-semibold border-2"
                    >
                      {t('common.cancel', { fallback: 'Cancel' })}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Results Section */}
              {result && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Generation Result
                      <Badge variant="outline">{result.status}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800">{result.message}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Your Specification:</h4>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded">{result.productSpec}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar with Examples */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 border">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('generate.examples.title', { fallback: 'Example Specifications' })}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t('generate.examples.description', { fallback: 'Click on any example to use it as a starting point for your own formula' })}
                  </p>
                </div>

                <div className="space-y-4">
                  {exampleSpecs.map((example, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-100 rounded-xl p-4 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all duration-300 group"
                      onClick={() => setProductSpec(example.description)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{example.title}</h4>
                        <Badge className="bg-blue-100 text-blue-800 text-xs font-semibold">{example.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{example.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {t('generate.tips.title', { fallback: 'Tips for Better Results' })}
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-900">{t('generate.tips.specific.title', { fallback: 'Be Specific:' })}</strong>
                      <span className="text-gray-600 ml-1">{t('generate.tips.specific.description', { fallback: 'Include target age group, skin type, and specific concerns' })}</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-900">{t('generate.tips.ingredients.title', { fallback: 'Mention Ingredients:' })}</strong>
                      <span className="text-gray-600 ml-1">{t('generate.tips.ingredients.description', { fallback: 'List preferred or avoided ingredients' })}</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-900">{t('generate.tips.texture.title', { fallback: 'Describe Texture:' })}</strong>
                      <span className="text-gray-600 ml-1">{t('generate.tips.texture.description', { fallback: 'Lightweight, rich, fast-absorbing, etc.' })}</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-900">{t('generate.tips.claims.title', { fallback: 'Include Claims:' })}</strong>
                      <span className="text-gray-600 ml-1">{t('generate.tips.claims.description', { fallback: 'What benefits should the product provide?' })}</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-900">{t('generate.tips.packaging.title', { fallback: 'Packaging Style:' })}</strong>
                      <span className="text-gray-600 ml-1">{t('generate.tips.packaging.description', { fallback: 'Luxury, eco-friendly, clinical, minimalist, etc.' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}