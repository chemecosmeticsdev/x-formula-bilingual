import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productName = searchParams.get('product') || 'Luxury Serum';
  const tonalStyling = searchParams.get('style') || 'elegant premium';
  const productType = searchParams.get('type') || 'serum';

  // Extract product name parts for display
  const nameParts = productName.split(' ');
  const brandName = nameParts[0]?.toUpperCase() || 'LUXURY';
  const productLine = nameParts.slice(1).join(' ').toUpperCase() || 'RENEWAL';

  // Determine styling based on tonal styling
  const isMinimal = tonalStyling.toLowerCase().includes('minimal') || tonalStyling.toLowerCase().includes('clean');
  const isLuxury = tonalStyling.toLowerCase().includes('luxury') || tonalStyling.toLowerCase().includes('premium');
  const isGold = tonalStyling.toLowerCase().includes('gold') || tonalStyling.toLowerCase().includes('metallic');
  const isGlass = tonalStyling.toLowerCase().includes('glass') || tonalStyling.toLowerCase().includes('frosted');

  // Color scheme based on styling
  const capColor = isGold ? '#f59e0b' : isLuxury ? '#1f2937' : '#6366f1';
  const labelBg = isMinimal ? '#ffffff' : '#f8fafc';
  const bottleOpacity = isGlass ? '0.7' : '0.9';

  // Generate a professional cosmetic product mockup SVG
  const svgContent = `
    <svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
        </linearGradient>

        <!-- Bottle gradient -->
        <linearGradient id="bottle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:${bottleOpacity}" />
          <stop offset="50%" style="stop-color:#f1f5f9;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#cbd5e1;stop-opacity:0.7" />
        </linearGradient>

        <!-- Cap gradient -->
        <linearGradient id="cap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${capColor};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${capColor}cc;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${capColor}99;stop-opacity:1" />
        </linearGradient>

        <!-- Label gradient -->
        <linearGradient id="label" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${labelBg};stop-opacity:0.95" />
          <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:0.9" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="256" height="256" fill="url(#bg)" />

      <!-- Drop shadow -->
      <ellipse cx="128" cy="240" rx="50" ry="8" fill="#000000" opacity="0.1"/>

      <!-- Bottle body -->
      <rect x="95" y="80" width="66" height="140" rx="8" ry="8" fill="url(#bottle)" stroke="#e2e8f0" stroke-width="1"/>

      <!-- Bottle neck -->
      <rect x="110" y="65" width="36" height="20" rx="2" ry="2" fill="url(#bottle)" stroke="#e2e8f0" stroke-width="1"/>

      <!-- Cap/Pump -->
      <rect x="105" y="45" width="46" height="25" rx="4" ry="4" fill="url(#cap)"/>
      <rect x="120" y="35" width="16" height="15" rx="2" ry="2" fill="url(#cap)"/>

      <!-- Label -->
      <rect x="100" y="110" width="56" height="80" rx="4" ry="4" fill="url(#label)" stroke="#e5e7eb" stroke-width="1"/>

      <!-- Brand text (customized) -->
      <text x="128" y="130" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle" fill="#1f2937">${brandName}</text>
      <text x="128" y="142" font-family="Arial, sans-serif" font-size="6" text-anchor="middle" fill="#6b7280">${productLine}</text>
      <text x="128" y="154" font-family="Arial, sans-serif" font-size="6" text-anchor="middle" fill="#6b7280">${productType.toUpperCase()}</text>

      <!-- Decorative lines -->
      <line x1="105" y1="165" x2="151" y2="165" stroke="#e5e7eb" stroke-width="1"/>
      <text x="128" y="175" font-family="Arial, sans-serif" font-size="4" text-anchor="middle" fill="#9ca3af">PREMIUM FORMULA</text>
      <text x="128" y="183" font-family="Arial, sans-serif" font-size="4" text-anchor="middle" fill="#9ca3af">ADVANCED PEPTIDES</text>

      <!-- Highlight/reflection -->
      <rect x="98" y="85" width="8" height="60" rx="4" ry="4" fill="#ffffff" opacity="0.3"/>

      <!-- Demo watermark -->
      <text x="128" y="205" font-family="Arial, sans-serif" font-size="3" text-anchor="middle" fill="#9ca3af" opacity="0.6">DEMO MOCKUP</text>
    </svg>
  `;

  return new NextResponse(svgContent, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}