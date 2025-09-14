import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">X FORMULA PLATFORM</h1>
              <Badge variant="secondary">v2.0</Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-teal-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-teal-600 transition-colors">How It Works</a>
              <a href="#showcase" className="text-gray-600 hover:text-teal-600 transition-colors">Showcase</a>
              <Link href="/generate">
                <Button className="bg-teal-600 hover:bg-teal-700">Generate Formula</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered <span className="text-teal-600">Cosmetic</span> Formulation
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced AI creates custom formulas AND product packaging designs.
            Get complete ready-to-sell kits in minutes, not months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-3">
                Start Creating →
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose X Formula Platform?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cutting-edge AI technology meets cosmetic science to deliver professional-grade formulations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-teal-600 text-2xl">🧪</span>
                </div>
                <CardTitle>AI-Powered Generation</CardTitle>
                <CardDescription>
                  Advanced algorithms analyze market trends and ingredient compatibility for optimal formulations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-teal-600 text-2xl">🎨</span>
                </div>
                <CardTitle>AI Packaging Design</CardTitle>
                <CardDescription>
                  Automatically generate professional product packaging mockups tailored to your brand and target market
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-teal-600 text-2xl">⚡</span>
                </div>
                <CardTitle>Rapid Prototyping</CardTitle>
                <CardDescription>
                  Generate multiple formula variations instantly and iterate quickly to find the perfect solution
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-teal-600 text-2xl">📦</span>
                </div>
                <CardTitle>Ready-to-Sell Kits</CardTitle>
                <CardDescription>
                  Complete formulation packages with ingredients, claims, regulatory guidance, and packaging design ready for market launch
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your vision into a complete ready-to-sell cosmetic kit
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Describe Your Vision</h3>
              <p className="text-gray-600">
                Tell us about your target product, desired benefits, and key ingredients you want to include
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Analysis & Design</h3>
              <p className="text-gray-600">
                Our AI analyzes market data, ingredient compatibility, formulation science, and generates both formulas and packaging designs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Your Ready-to-Sell Kit</h3>
              <p className="text-gray-600">
                Receive detailed formulations, packaging mockups, ingredient lists, manufacturing guidance, and market positioning ready for launch
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formula Showcase Section */}
      <section id="showcase" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Formula Showcase</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Examples of AI-generated formulations created by our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="w-full h-32 bg-gradient-to-br from-pink-100 to-rose-200 rounded-lg mb-4"></div>
                <CardTitle className="text-lg">Anti-Aging Serum</CardTitle>
                <CardDescription>Premium formula targeting fine lines and wrinkles for mature skin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Key Ingredients:</strong> Retinol, Hyaluronic Acid, Peptides</div>
                  <div><strong>Target Age:</strong> 35-50 years</div>
                  <div><strong>Key Claims:</strong> 30% wrinkle reduction in 8 weeks</div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="w-full h-32 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg mb-4"></div>
                <CardTitle className="text-lg">Natural Face Cleanser</CardTitle>
                <CardDescription>Gentle foam cleanser with botanical ingredients for sensitive skin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Key Ingredients:</strong> Aloe Vera, Chamomile, Green Tea</div>
                  <div><strong>Skin Type:</strong> Sensitive, all ages</div>
                  <div><strong>Key Claims:</strong> 100% natural, pH balanced</div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-lg mb-4"></div>
                <CardTitle className="text-lg">Hydrating Moisturizer</CardTitle>
                <CardDescription>24-hour moisture lock formula for dry and dehydrated skin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Key Ingredients:</strong> Ceramides, Squalane, Niacinamide</div>
                  <div><strong>Skin Type:</strong> Dry, combination</div>
                  <div><strong>Key Claims:</strong> 24h hydration, barrier repair</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Revolutionize Your Product Development?</h2>
          <p className="text-xl mb-8 text-teal-100">
            Join industry leaders using AI to create innovative cosmetic formulations
          </p>
          <Link href="/generate">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Generate Your First Formula
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
                AI-powered cosmetic formulation for the next generation of beauty products.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/generate" className="hover:text-white transition-colors">Formula Generator</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 X Formula Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}