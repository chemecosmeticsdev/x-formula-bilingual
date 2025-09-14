// Tests for image generation API
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../../src/app/api/generate-image/route'

// Mock NextRequest
class MockNextRequest {
  constructor(private body: any) {}

  async json() {
    return this.body
  }
}

describe('/api/generate-image', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
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
    expect(data.imageUrl).toBe('/api/demo-image')
  })

  it('should process successful Lambda image response', async () => {
    const mockImageUrl = 'https://formula-platform-images.s3.amazonaws.com/test.png'
    const mockLambdaResponse = {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        imageUrl: mockImageUrl,
        s3_url: mockImageUrl,
        metadata: {
          model: 'amazon.nova-canvas-v1:0',
          dimensions: '1024x1024',
          generated_at: new Date().toISOString()
        }
      })
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
    global.fetch = vi.fn().mockRejectedValue(new Error('Expected failure'))

    const request = new MockNextRequest({
      productName: 'Renewal Serum',
      tonalStyling: 'Frosted glass with metallic accents',
      productType: 'serum'
    })

    await POST(request as any)

    // Verify fetch was called with proper prompt structure
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('Renewal Serum')
      })
    )
  })

  it('should handle Nova Canvas fallback to Titan', async () => {
    // Mock Nova Canvas failure, then Titan failure
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 403 }) // Nova Canvas fails
      .mockResolvedValueOnce({ ok: false, status: 403 }) // Titan fails

    const request = new MockNextRequest({
      productName: 'Test Product',
      tonalStyling: 'Premium styling',
      productType: 'serum'
    })
    const response = await POST(request as any)
    const data = await response.json()

    expect(global.fetch).toHaveBeenCalledTimes(2) // Nova Canvas + Titan
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.imageUrl).toBe('/api/demo-image') // fallback
  })

  it('should handle different image model types', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Test'))

    // Test Nova Canvas
    const novaRequest = new MockNextRequest({
      productName: 'Test',
      tonalStyling: 'Test',
      productType: 'serum'
    })
    await POST(novaRequest as any)

    const callArgs = (global.fetch as any).mock.calls[0][1]
    const body = JSON.parse(callArgs.body)
    expect(body.model).toBe('amazon.nova-canvas-v1:0')
  })
})