"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function GeneratePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  const [productSpec, setProductSpec] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Removed unused result state for cleaner code

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
      // Error handling removed for cleaner UX
    } finally {
      setIsLoading(false);
    }
  };

  // Removed unused useExample function as examples now use onClick inline

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${locale}`} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <span className="mr-2">←</span>
              <span>{t('common.back', { fallback: 'Back' })} {t('navigation.home', { fallback: 'Home' })}</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t('homepage.title', { fallback: 'X FORMULA PLATFORM' })}</h1>
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero Icon and Heading */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 mx-auto mb-8 bg-blue-100 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-blue-600 text-3xl">🧪</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {t('generate.title', { fallback: 'Generate Your Formula' })}
            </h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              {t('generate.subtitle', { fallback: 'Describe your cosmetic product and let AI create the perfect formulation' })}
            </p>
          </div>

          {/* Simple Form */}
          <div className="mb-16">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <Label htmlFor="productSpec" className="text-gray-900 font-semibold text-lg mb-4 block">
                  {t('generate.form.productDescription.label', { fallback: 'Product Description' })}
                </Label>
                <Textarea
                  id="productSpec"
                  placeholder={t('generate.form.productDescription.placeholder', { fallback: 'Describe your cosmetic product (e.g., anti-aging serum with hyaluronic acid and peptides for mature skin)' })}
                  value={productSpec}
                  onChange={(e) => setProductSpec(e.target.value)}
                  rows={8}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl text-base leading-relaxed focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none shadow-sm"
                />
                <p className="text-gray-500 mt-4 text-base leading-relaxed">
                  {t('generate.form.description', { fallback: 'Provide detailed information about your desired cosmetic product. Be specific about target audience, key benefits, preferred ingredients, and packaging preferences.' })}
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={!productSpec.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-12 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[240px]"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin text-xl">⟳</span>
                      <span>{t('generate.form.generating', { fallback: 'Generating your formula...' })}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🧪</span>
                      <span>{t('generate.form.submit', { fallback: 'Generate Formula' })}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Example Specifications */}
          <div className="border-t border-gray-200 pt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-12 text-center">
              {t('generate.examples.title', { fallback: 'Example Specifications' })}
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {exampleSpecs.map((example, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-xl p-8 cursor-pointer hover:border-blue-300 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 bg-white"
                  onClick={() => setProductSpec(example.description)}
                >
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-lg">
                      {example.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">{example.title}</h4>
                  <p className="text-gray-600 leading-relaxed italic">
                    &ldquo;{example.description}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}