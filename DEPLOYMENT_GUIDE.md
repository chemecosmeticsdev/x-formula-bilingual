# Formula Platform - Production Deployment Guide

## AWS Amplify Deployment Instructions

### Prerequisites
- AWS Account with Amplify access
- GitHub repository with the Formula Platform code
- AWS Lambda functions deployed for:
  - Formula generation (`LAMBDA_BEDROCK_ENDPOINT`)
  - Image generation (`LAMBDA_BEDROCK_IMAGE_ENDPOINT`)

### Step 1: AWS Amplify Setup

1. **Create Amplify App**
   ```bash
   # In AWS Amplify Console:
   # 1. Connect to GitHub repository
   # 2. Select main/master branch
   # 3. Build settings will auto-detect amplify.yml
   ```

2. **Environment Variables Configuration**

   Set the following environment variables in AWS Amplify Console:

   **Required Variables:**
   ```
   NODE_ENV=production
   LAMBDA_BEDROCK_ENDPOINT=https://your-production-lambda-endpoint.amazonaws.com/prod/chat
   LAMBDA_BEDROCK_IMAGE_ENDPOINT=https://your-production-image-lambda-endpoint.amazonaws.com/prod/generate-image
   BEDROCK_ACCESS_KEY_ID=your_aws_access_key_here
   BEDROCK_SECRET_ACCESS_KEY=your_aws_secret_key_here
   BEDROCK_REGION=us-east-1
   ```

   **Optional Variables:**
   ```
   SENTRY_DSN=your_sentry_dsn_for_error_monitoring
   GA_TRACKING_ID=your_google_analytics_id
   ```

### Step 2: Custom Domain Setup (Optional)

1. **Add Custom Domain**
   ```bash
   # In Amplify Console > Domain management
   # Add your domain (e.g., formula-platform.com)
   # Configure DNS with your domain provider
   ```

2. **SSL Certificate**
   - AWS Amplify automatically provisions SSL certificates
   - Verify HTTPS redirection is working

### Step 3: Performance Optimization

1. **CDN Configuration**
   - AWS Amplify uses CloudFront CDN automatically
   - Static assets are cached globally
   - API routes are served from the nearest edge location

2. **Build Optimization**
   ```bash
   # Build settings are configured in amplify.yml
   # Includes:
   # - Bundle analysis
   # - File tracing exclusions
   # - Compression enabled
   ```

### Step 4: Monitoring and Analytics

1. **AWS CloudWatch**
   - Monitor application performance
   - Set up alerts for errors
   - Track API response times

2. **Error Tracking** (Optional)
   - Configure Sentry for error monitoring
   - Set up alerts for critical errors

### Step 5: Post-Deployment Testing

1. **Functionality Tests**
   ```bash
   # Test all critical paths:
   # - Homepage (EN/TH locales)
   # - Formula generation
   # - Image generation
   # - API endpoints
   ```

2. **Performance Tests**
   ```bash
   # Use tools like:
   # - Google PageSpeed Insights
   # - WebPageTest
   # - Lighthouse
   ```

3. **Security Tests**
   ```bash
   # Verify:
   # - HTTPS enforcement
   # - Security headers
   # - API rate limiting
   # - Environment variable protection
   ```

### Environment Variable Security

**Never commit these to version control:**
- `BEDROCK_ACCESS_KEY_ID`
- `BEDROCK_SECRET_ACCESS_KEY`
- `LAMBDA_BEDROCK_ENDPOINT`
- `LAMBDA_BEDROCK_IMAGE_ENDPOINT`

**Set these only in AWS Amplify Console Environment Variables.**

### Rollback Strategy

1. **Branch-based Rollback**
   ```bash
   # Create rollback branch from last known good commit
   # Deploy to Amplify from rollback branch
   ```

2. **Environment Rollback**
   ```bash
   # Amplify maintains deployment history
   # Can rollback to previous deployment in console
   ```

### Troubleshooting

**Common Issues:**

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check for TypeScript errors

2. **Runtime Errors**
   - Verify environment variables are set
   - Check Lambda endpoint connectivity
   - Verify AWS IAM permissions

3. **Performance Issues**
   - Check bundle size with `npm run build:analyze`
   - Optimize images and assets
   - Review CDN caching settings

### Support and Maintenance

1. **Regular Updates**
   ```bash
   # Update dependencies monthly
   npm audit
   npm update
   ```

2. **Security Monitoring**
   ```bash
   # Run security audit regularly
   npm audit --audit-level=moderate
   ```

3. **Performance Monitoring**
   - Monitor Core Web Vitals
   - Track API response times
   - Monitor error rates

## Production Checklist

- [ ] AWS Amplify app created and connected to repository
- [ ] Environment variables configured securely
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate verified
- [ ] All API endpoints tested
- [ ] Both EN and TH locales tested
- [ ] Performance metrics within acceptable ranges
- [ ] Security headers verified
- [ ] Error monitoring configured
- [ ] Backup and rollback strategy documented
- [ ] Team access and permissions configured

## Emergency Contacts

- **DevOps Team**: [Contact information]
- **AWS Support**: [Support case information]
- **Domain Provider**: [Contact information]

---

**Last Updated**: December 2024
**Version**: 2.0.0