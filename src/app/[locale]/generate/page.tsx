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
              <span>Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">X FORMULA PLATFORM</h1>
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero Icon and Heading */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-2xl">🧪</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Describe Your Product Vision
            </h1>
            <p className="text-gray-600 text-lg">
              Tell us about your product goals, target market, key requirements, and any specific claims you want to make. The more detailed you are, the better our AI can help you.
            </p>
          </div>

          {/* Simple Form */}
          <div className="mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="productSpec" className="text-gray-900 font-medium mb-2 block">
                  Product Specification
                </Label>
                <Textarea
                  id="productSpec"
                  placeholder="A lightweight, hydrating daily moisturizer for sensitive skin with SPF 30 and anti-pollution claims. Target demographic: Bangkok residents aged 25-35. Key requirements: fragrance-free, reef-safe sunscreen, suitable for all skin tones."
                  value={productSpec}
                  onChange={(e) => setProductSpec(e.target.value)}
                  rows={6}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Include details about target audience, skin type, desired benefits, key ingredients, packaging preferences, and any regulatory requirements.
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={!productSpec.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>🧪</span>
                      <span>Generate Formula</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Example Specifications */}
          <div className="border-t border-gray-200 pt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">
              Example Specifications
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {exampleSpecs.map((example, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                  onClick={() => setProductSpec(example.description)}
                >
                  <h4 className="font-semibold text-gray-900 mb-2">{example.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed italic">
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