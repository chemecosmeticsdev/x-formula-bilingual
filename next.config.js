const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  // File tracing exclusions for smaller builds
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@swc/core-darwin-arm64',
      'node_modules/@swc/core-darwin-x64',
      'node_modules/@esbuild/linux-x64',
      'node_modules/@esbuild/darwin-arm64',
      'node_modules/@esbuild/darwin-x64',
    ],
  },

  // Image optimization for AWS Amplify
  images: {
    domains: [
      'formula-platform-generated-images.s3.ap-southeast-1.amazonaws.com',
      's3.amazonaws.com',
      'amazonaws.com'
    ],
    unoptimized: false,
  },

  // Compression and performance
  compress: true,
  poweredByHeader: false,

  // Disable ESLint during build for production
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);