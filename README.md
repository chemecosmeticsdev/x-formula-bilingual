# X Formula Platform 🧪

> AI-Powered Cosmetic Formulation Platform with Bilingual Support

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![AWS Amplify](https://img.shields.io/badge/AWS-Amplify-orange)](https://aws.amazon.com/amplify/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC)](https://tailwindcss.com/)

## 🌟 Features

### Core Functionality
- **AI Formula Generation**: Advanced AI creates professional cosmetic formulations using AWS Bedrock
- **AI Image Generation**: Automated product packaging mockups with Titan and Nova Canvas models
- **Bilingual Support**: Full internationalization with English and Thai locales
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Processing**: Live formula generation and image creation

### Technical Features
- **Next.js 15 App Router**: Modern React framework with server-side rendering
- **TypeScript**: Full type safety and developer experience
- **AWS Bedrock Integration**: AI-powered formula and image generation
- **Production Ready**: Optimized builds, security headers, and performance monitoring
- **Fallback Systems**: Demo images and error handling for reliability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- AWS Account (for production deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/chemecosmeticsdev/x-formula-bilingual.git
   cd x-formula-bilingual
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:
   ```env
   # Required for AI functionality
   LAMBDA_BEDROCK_ENDPOINT=https://your-lambda-endpoint.amazonaws.com/prod/chat
   LAMBDA_BEDROCK_IMAGE_ENDPOINT=https://your-lambda-endpoint.amazonaws.com/prod/generate-image
   BEDROCK_ACCESS_KEY_ID=your_aws_access_key
   BEDROCK_SECRET_ACCESS_KEY=your_aws_secret_key
   BEDROCK_REGION=us-east-1
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Production Deployment

### AWS Amplify Deployment

This project is optimized for AWS Amplify deployment with automatic CI/CD.

1. **Connect to AWS Amplify**
   - Link your GitHub repository to AWS Amplify
   - Amplify will automatically detect the `amplify.yml` configuration

2. **Configure Environment Variables**
   Set these in AWS Amplify Console > Environment Variables:
   ```
   LAMBDA_BEDROCK_ENDPOINT
   LAMBDA_BEDROCK_IMAGE_ENDPOINT
   BEDROCK_ACCESS_KEY_ID
   BEDROCK_SECRET_ACCESS_KEY
   BEDROCK_REGION
   ```

3. **Deploy**
   - Push to `main` branch triggers automatic deployment
   - Monitor build logs in AWS Amplify Console

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🌐 Internationalization

The platform supports full bilingual functionality:

- **English (EN)**: Default language
- **Thai (TH)**: Complete Thai localization

### Language Files
- `messages/en.json` - English translations
- `messages/th.json` - Thai translations

### Adding New Languages
1. Create new message file in `messages/[locale].json`
2. Add locale to `src/i18n/config.ts`
3. Update middleware configuration
4. Add language option to `LanguageSwitcher` component

## 📡 API Endpoints

### `/api/generate`
Generate AI formulations based on product specifications.

**Method**: POST
**Body**:
```json
{
  "productSpec": "Create a luxury anti-aging serum for mature skin..."
}
```

### `/api/generate-image`
Generate product packaging mockups using AWS Bedrock.

**Method**: POST
**Body**:
```json
{
  "productName": "Luxury Serum",
  "tonalStyling": "elegant premium gold",
  "productType": "serum"
}
```

### `/api/demo-image`
Generate fallback SVG product mockups.

**Method**: GET
**Query Parameters**: `product`, `style`, `type`

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run audit        # Security audit
npm test             # Run tests
```

### Project Structure

```
├── src/
│   ├── app/
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── generate/      # Formula generation page
│   │   │   ├── result/        # Results display
│   │   │   └── page.tsx       # Homepage
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── i18n/                  # Internationalization config
│   └── lib/                   # Utilities and helpers
├── messages/                  # Translation files
├── public/                    # Static assets
├── amplify.yml               # AWS Amplify build config
└── DEPLOYMENT_GUIDE.md       # Production deployment guide
```

## 🧪 Testing

### Running Tests
```bash
npm test              # Run all tests
npm run test:ci       # Run tests in CI mode
```

### Test Coverage
- Unit tests for components
- API endpoint testing
- Internationalization testing
- Build and deployment validation

## 🔒 Security

### Security Features
- Security headers (CSP, HSTS, etc.)
- Environment variable protection
- Input validation and sanitization
- Rate limiting on API endpoints
- HTTPS enforcement

### Security Audit
```bash
npm audit             # Check for vulnerabilities
npm audit fix         # Auto-fix security issues
```

## 📊 Performance

### Optimization Features
- Static site generation where possible
- Image optimization with Next.js Image
- Bundle size optimization
- CDN delivery via AWS CloudFront
- Lazy loading and code splitting

### Bundle Analysis
```bash
npm run build:analyze  # Analyze bundle size
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software owned by ChemeCosmeticsDev.

## 🆘 Support

### Documentation
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [AWS Amplify Documentation](https://docs.amplify.aws/)

### Contact
- **Technical Support**: [support@chemecosmeticsdev.com]
- **Repository Issues**: [GitHub Issues](https://github.com/chemecosmeticsdev/x-formula-bilingual/issues)

## 🔄 Version History

### v2.0.0 (Current)
- ✅ Bilingual support (EN/TH)
- ✅ AI formula generation with AWS Bedrock
- ✅ AI image generation with fallback systems
- ✅ Production-ready deployment configuration
- ✅ Comprehensive testing and security measures
- ✅ Performance optimizations

---

**Built with ❤️ by ChemeCosmeticsDev Team**