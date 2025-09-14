"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [result, setResult] = useState<any>(null);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href={`/${locale}`}>
                <h1 className="text-2xl font-bold text-gray-900 hover:text-teal-600 transition-colors cursor-pointer">
                  {t('homepage.title')}
                </h1>
              </Link>
              <Badge variant="secondary">{t('homepage.version')}</Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href={`/${locale}#features`} className="text-gray-600 hover:text-teal-600 transition-colors">
                {t('navigation.features')}
              </Link>
              <Link href={`/${locale}#how-it-works`} className="text-gray-600 hover:text-teal-600 transition-colors">
                {t('navigation.howItWorks')}
              </Link>
              <Link href={`/${locale}`} className="text-gray-600 hover:text-teal-600 transition-colors">
                {t('navigation.home')}
              </Link>
              <LanguageSwitcher />
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('generate.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('generate.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('generate.form.productDescription.label')}</CardTitle>
                  <CardDescription>
                    {t('generate.form.description', {
                      fallback: 'Provide detailed information about your desired cosmetic product. Be specific about target audience, key benefits, preferred ingredients, and packaging preferences.'
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="productSpec">
                        {t('generate.form.productDescription.label')}
                      </Label>
                      <Textarea
                        id="productSpec"
                        placeholder={t('generate.form.productDescription.placeholder')}
                        value={productSpec}
                        onChange={(e) => setProductSpec(e.target.value)}
                        rows={8}
                        className="min-h-[200px]"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={!productSpec.trim() || isLoading}
                        className="bg-teal-600 hover:bg-teal-700 flex-1"
                      >
                        {isLoading ? (
                          <>
                            <span className="animate-spin mr-2">⟳</span>
                            {t('generate.form.generating')}
                          </>
                        ) : (
                          t('generate.form.submit')
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setProductSpec("")}
                        disabled={!productSpec.trim()}
                      >
                        {t('common.cancel', { fallback: 'Clear' })}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

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
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('generate.examples.title', { fallback: 'Example Specifications' })}
                  </CardTitle>
                  <CardDescription>
                    {t('generate.examples.description', { fallback: 'Click on any example to use it as a starting point for your own formula' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {exampleSpecs.map((example, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => useExample(example.description)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{example.title}</h4>
                        <Badge variant="secondary" className="text-xs">{example.category}</Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-3">{example.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('generate.tips.title', { fallback: 'Tips for Better Results' })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <div>
                    <strong>{t('generate.tips.specific.title', { fallback: 'Be Specific:' })}</strong> {t('generate.tips.specific.description', { fallback: 'Include target age group, skin type, and specific concerns' })}
                  </div>
                  <div>
                    <strong>{t('generate.tips.ingredients.title', { fallback: 'Mention Ingredients:' })}</strong> {t('generate.tips.ingredients.description', { fallback: 'List preferred or avoided ingredients' })}
                  </div>
                  <div>
                    <strong>{t('generate.tips.texture.title', { fallback: 'Describe Texture:' })}</strong> {t('generate.tips.texture.description', { fallback: 'Lightweight, rich, fast-absorbing, etc.' })}
                  </div>
                  <div>
                    <strong>{t('generate.tips.claims.title', { fallback: 'Include Claims:' })}</strong> {t('generate.tips.claims.description', { fallback: 'What benefits should the product provide?' })}
                  </div>
                  <div>
                    <strong>{t('generate.tips.packaging.title', { fallback: 'Packaging Style:' })}</strong> {t('generate.tips.packaging.description', { fallback: 'Luxury, eco-friendly, clinical, minimalist, etc.' })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}