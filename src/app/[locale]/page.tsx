"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function Homepage({ params, searchParams }: Props) {
  const routerParams = useParams();
  const locale = routerParams.locale as string;
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {t('homepage.title', { fallback: 'X FORMULA PLATFORM' })}
              </h1>
              <Badge variant="secondary">
                {t('homepage.version', { fallback: 'v2.0' })}
              </Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-teal-600 transition-colors">
                {t('navigation.features', { fallback: 'Features' })}
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-teal-600 transition-colors">
                {t('navigation.howItWorks', { fallback: 'How It Works' })}
              </a>
              <a href="#showcase" className="text-gray-600 hover:text-teal-600 transition-colors">
                {t('navigation.showcase', { fallback: 'Showcase' })}
              </a>
              <LanguageSwitcher />
              <Link href={`/${locale}/generate`}>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  {t('navigation.generateFormula', { fallback: 'Generate Formula' })}
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('homepage.hero.title', { fallback: 'AI-Powered {highlight} Formulation', highlight: t('homepage.hero.highlight', { fallback: 'Cosmetic' }) })}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('homepage.hero.subtitle', { fallback: 'Advanced AI creates custom formulas AND product packaging designs. Get complete ready-to-sell kits in minutes, not months.' })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/generate`}>
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-3">
                {t('homepage.hero.ctaPrimary', { fallback: 'Start Creating →' })}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              {t('homepage.hero.ctaSecondary', { fallback: 'Watch Demo' })}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('homepage.features.title', { fallback: 'Why Choose X Formula Platform?' })}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('homepage.features.subtitle', { fallback: 'Transform your cosmetic business with cutting-edge AI technology' })}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-teal-600 text-2xl">🧪</span>
                </div>
                <CardTitle>{t('homepage.features.aiFormula.title', { fallback: 'AI Formula Generation' })}</CardTitle>
                <CardDescription>
                  {t('homepage.features.aiFormula.description', { fallback: 'Generate professional cosmetic formulations using advanced AI algorithms trained on thousands of proven formulas.' })}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-teal-600 text-2xl">🎨</span>
                </div>
                <CardTitle>{t('homepage.features.aiPackaging.title', { fallback: 'AI Packaging Design' })}</CardTitle>
                <CardDescription>
                  {t('homepage.features.aiPackaging.description', { fallback: 'AI-powered packaging mockups that match your product\'s aesthetic and target market perfectly.' })}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-teal-600 text-2xl">⚡</span>
                </div>
                <CardTitle>{t('homepage.features.readyKits.title', { fallback: 'Rapid Prototyping' })}</CardTitle>
                <CardDescription>
                  {t('homepage.features.readyKits.description', { fallback: 'Generate multiple formula variations instantly and iterate quickly to find the perfect solution' })}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-teal-600 text-2xl">📦</span>
                </div>
                <CardTitle>{t('homepage.features.compliance.title', { fallback: 'Ready-to-Sell Kits' })}</CardTitle>
                <CardDescription>
                  {t('homepage.features.compliance.description', { fallback: 'Complete formulation packages with ingredients, claims, regulatory guidance, and packaging design ready for market launch' })}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('homepage.howItWorks.title', { fallback: 'How It Works' })}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('homepage.howItWorks.subtitle', { fallback: 'Three simple steps to transform your vision into a complete ready-to-sell cosmetic kit' })}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t('homepage.howItWorks.step1.title', { fallback: 'Describe Your Product' })}
              </h3>
              <p className="text-gray-600">
                {t('homepage.howItWorks.step1.description', { fallback: 'Tell us about your cosmetic product vision, target market, and desired effects.' })}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t('homepage.howItWorks.step2.title', { fallback: 'AI Creates Formula' })}
              </h3>
              <p className="text-gray-600">
                {t('homepage.howItWorks.step2.description', { fallback: 'Our AI analyzes your requirements and generates a professional formulation with detailed ingredients.' })}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t('homepage.howItWorks.step3.title', { fallback: 'Design Packaging' })}
              </h3>
              <p className="text-gray-600">
                {t('homepage.howItWorks.step3.description', { fallback: 'Get AI-generated packaging mockups that perfectly match your product and brand aesthetic.' })}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                4
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t('homepage.howItWorks.step4.title', { fallback: 'Launch Product' })}
              </h3>
              <p className="text-gray-600">
                {t('homepage.howItWorks.step4.description', { fallback: 'Download your complete product kit and start selling within hours, not months.' })}
              </p>
            </div>
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
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              {t('homepage.cta.button', { fallback: 'Generate Your First Formula' })}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">X Formula Platform</h3>
              <p className="text-gray-400">
                {t('homepage.footer.description', { fallback: 'AI-powered cosmetic formulation for the next generation of beauty products.' })}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">
                {t('homepage.footer.product.title', { fallback: 'Product' })}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href={`/${locale}/generate`} className="hover:text-white transition-colors">
                  {t('homepage.footer.product.generator', { fallback: 'Formula Generator' })}
                </Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">
                  {t('navigation.features', { fallback: 'Features' })}
                </a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">
                  {t('navigation.howItWorks', { fallback: 'How It Works' })}
                </a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">
                {t('homepage.footer.company.title', { fallback: 'Company' })}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">
                  {t('homepage.footer.company.about', { fallback: 'About' })}
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors">
                  {t('homepage.footer.company.contact', { fallback: 'Contact' })}
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors">
                  {t('homepage.footer.company.support', { fallback: 'Support' })}
                </a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t('homepage.footer.copyright', { fallback: '© 2025 X Formula Platform. All rights reserved.' })}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}