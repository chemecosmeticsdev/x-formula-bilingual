"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function Homepage(_props: Props) {
  const routerParams = useParams();
  const locale = routerParams.locale as string;
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {t('homepage.title', { fallback: 'X FORMULA PLATFORM' })}
              </h1>
            </div>
            <nav className="flex items-center space-x-8">
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  {t('navigation.features', { fallback: 'Features' })}
                </a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  {t('navigation.howItWorks', { fallback: 'How It Works' })}
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  {t('navigation.about', { fallback: 'About' })}
                </a>
              </div>
              <LanguageSwitcher />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-24 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            CREATE FORMULA IDEAS<br />
            <span className="text-blue-600">
              WITH AI
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Get concepts, claims, and more. Powered by Chemecosmetics
          </p>
          <div className="mb-16">
            <Link href={`/${locale}/generate`}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-12 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                GENERATE FORMULA
                <span className="ml-3 text-xl">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">🧪</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Formula Generation</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Advanced AI creates custom formulas based on your specifications
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">📊</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trend Analysis</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stay ahead with market trend analysis and consumer insights
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">📦</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ready-to-Sell Kits</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Complete formulation packages ready for market launch
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">🏭</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">OEM/ODM Service</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Full manufacturing support from concept to market
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">HOW IT WORKS</h2>
            <p className="text-gray-600 text-lg">Simple steps to your perfect formula</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  01
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Specify product goals</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tell us your product vision, target market, and key requirements
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  02
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Get a concept and formula</h3>
                <p className="text-gray-600 leading-relaxed">
                  AI generates a complete concept with ingredients and claims
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  03
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pay and receive samples</h3>
                <p className="text-gray-600 leading-relaxed">
                  Order prototypes and receive professional samples
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formula Showcase Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">FORMULA SHOWCASE</h2>
            <p className="text-gray-600 text-lg">See what our AI can create for you</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-blue-600">AI</span>
                </div>
              </div>
              <p className="text-gray-600 font-medium">AI-Generated Formula Visualization</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  01
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Advanced Anti-Aging Serum with proven results in clinical studies
                  </h3>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  02
                </div>
                <div>
                  <p className="text-gray-600 leading-relaxed">
                    Get a detailed eco-formula with sustainably sourced ingredients and biodegradable packaging options
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  03
                </div>
                <div>
                  <p className="text-gray-600 leading-relaxed">
                    Pay and receive samples with complete documentation and regulatory compliance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">CUSTOMER TESTIMONIALS</h2>
            <p className="text-gray-600 text-lg">What our clients say about us</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white p-6 shadow-lg border-none">
              <CardContent className="p-0">
                <div className="flex justify-center mb-4">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
                <p className="text-gray-600 italic mb-6 text-center leading-relaxed">
                  &ldquo;The AI-generated formulas saved us months of R&amp;D time. Incredible accuracy and market relevance.&rdquo;
                </p>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">Sarah Chen</p>
                  <p className="text-gray-500 text-sm">Beauty Innovations Co.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white p-6 shadow-lg border-none">
              <CardContent className="p-0">
                <div className="flex justify-center mb-4">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
                <p className="text-gray-600 italic mb-6 text-center leading-relaxed">
                  &ldquo;Outstanding ingredient recommendations that perfectly matched our sustainability goals.&rdquo;
                </p>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">Marcus Rodriguez</p>
                  <p className="text-gray-500 text-sm">Natural Cosmetics Ltd.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white p-6 shadow-lg border-none">
              <CardContent className="p-0">
                <div className="flex justify-center mb-4">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
                <p className="text-gray-600 italic mb-6 text-center leading-relaxed">
                  &ldquo;The scientific approach and detailed analysis exceeded our expectations completely.&rdquo;
                </p>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">Dr. Emily Watson</p>
                  <p className="text-gray-500 text-sm">SkinCare Research Institute</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            {t('homepage.cta.title', { fallback: 'Ready to Revolutionize Your Product Development?' })}
          </h2>
          <p className="text-xl mb-8 text-teal-100">
            {t('homepage.cta.subtitle', { fallback: 'Join industry leaders using AI to create innovative cosmetic formulations' })}
          </p>
          <Link href={`/${locale}/generate`}>
            <Button size="lg" className="bg-white hover:bg-gray-50 text-teal-600 border-2 border-white hover:border-gray-200 text-lg px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200">
              {t('homepage.cta.button', { fallback: 'Generate Your First Formula' })}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">X FORMULA PLATFORM</h3>
              <p className="text-gray-400 mb-4">
                Powered by Chemecosmetics
              </p>
            </div>
            <div>
              <div className="flex flex-wrap gap-6 text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Contact</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
                <a href="#" className="hover:text-white transition-colors">Documentation</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}