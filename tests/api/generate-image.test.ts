// Tests for image generation API
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST } from '../../src/app/api/generate-image/route'

// Mock NextRequest
class MockNextRequest {
  constructor(private body: any) {}

  async json() {
    return this.body
  }
}

describe('/api/generate-image', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    originalEnv = process.env
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should return 400 for missing required fields', async () => {
    const request = new MockNextRequest({})
    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Product name and tonal styling are required')
  })

  it('should return fallback demo image when Lambda fails', async () => {
    // Mock Lambda failure
    global.fetch = vi.fn().mockRejectedValue(new Error('Lambda failed'))

    const request = new MockNextRequest({
      productName: 'Test Serum',
      tonalStyling: 'Frosted glass with gold accents',
      productType: 'serum'
    })
    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.imageUrl).toContain('/api/demo-image?product=Test%20Serum')
  })

  it('should process successful Lambda image response', async () => {
    // Set environment variable for this test
    process.env.LAMBDA_BEDROCK_IMAGE_ENDPOINT = 'https://test-lambda-endpoint.com'

    const mockImageUrl = 'https://formula-platform-images.s3.amazonaws.com/test.png'
    const mockLambdaResponse = {
      success: true,
      imageUrl: mockImageUrl,
      s3_url: mockImageUrl,
      metadata: {
        model: 'amazon.nova-canvas-v1:0',
        dimensions: '1024x1024',
        generated_at: new Date().toISOString()
      }
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLambdaResponse)
    })

    const request = new MockNextRequest({
      productName: 'Luxury Serum',
      tonalStyling: 'Premium glass bottle',
      productType: 'serum'
    })
    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.imageUrl).toBe(mockImageUrl)
  })

  it('should construct proper prompt from user input', async () => {
    // Set environment variable to test Lambda calls
    process.env.LAMBDA_BEDROCK_IMAGE_ENDPOINT = 'https://test-lambda-endpoint.com'

    global.fetch = vi.fn().mockRejectedValue(new Error('Expected failure'))

    const request = new MockNextRequest({
      productName: 'Renewal Serum',
      tonalStyling: 'Frosted glass with metallic accents',
      productType: 'serum'
    })

    await POST(request as any)

    // Verify fetch was called with proper prompt structure
    expect(global.fetch).toHaveBeenCalledWith(
      'https://test-lambda-endpoint.com',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('Renewal Serum')
      })
    )
  })

  it('should handle Nova Canvas fallback to Titan', async () => {
    // Set environment variable to test Lambda calls
    process.env.LAMBDA_BEDROCK_IMAGE_ENDPOINT = 'https://test-lambda-endpoint.com'

    // Mock Nova Canvas failure, then Titan failure
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: () => Promise.resolve('Rate limit exceeded')
      }) // Nova Canvas fails
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: () => Promise.resolve('Rate limit exceeded')
      }) // Titan fails

    const request = new MockNextRequest({
      productName: 'Test Product',
      tonalStyling: 'Premium styling',
      productType: 'serum'
    })
    const response = await POST(request as any)
    const data = await response.json()

    expect(global.fetch).toHaveBeenCalledTimes(2) // Titan first, then Nova Canvas fallback
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.imageUrl).toContain('/api/demo-image') // fallback
  })

  it('should handle different image model types', async () => {
    // Set environment variable to test Lambda calls
    process.env.LAMBDA_BEDROCK_IMAGE_ENDPOINT = 'https://test-lambda-endpoint.com'

    global.fetch = vi.fn().mockRejectedValue(new Error('Test'))

    // Test Titan first (the current implementation tries Titan first)
    const titanRequest = new MockNextRequest({
      productName: 'Test',
      tonalStyling: 'Test',
      productType: 'serum'
    })
    await POST(titanRequest as any)

    // Should call Titan first
    expect(global.fetch).toHaveBeenCalledWith(
      'https://test-lambda-endpoint.com',
      expect.objectContaining({
        body: expect.stringContaining('"model":"amazon.titan-image-generator-v1"')
      })
    )
  })
})