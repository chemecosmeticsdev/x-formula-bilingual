// Tests for formula generation API
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../../src/app/api/generate/route'

// Mock NextRequest
class MockNextRequest {
  constructor(private body: any) {}

  async json() {
    return this.body
  }
}

describe('/api/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('should return 400 for missing productSpec', async () => {
    const request = new MockNextRequest({})
    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Product specification is required')
  })

  it('should return fallback data when Lambda fails', async () => {
    // Mock Lambda failure
    global.fetch = vi.fn().mockRejectedValue(new Error('Lambda failed'))

    const request = new MockNextRequest({ productSpec: 'anti-aging serum' })
    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.product).toBeDefined()
    expect(data.product.name).toBe('LUMINOUS RENEWAL SERUM')
    expect(data.product.ingredients).toHaveLength(6)
  })

  it('should process successful Lambda response', async () => {
    const mockLambdaResponse = {
      response: JSON.stringify({
        name: 'TEST SERUM',
        description: 'Test description',
        claims: ['Test claim 1', 'Test claim 2'],
        ingredients: [
          { name: 'Test Ingredient', percentage: '2.0%' }
        ],
        tonalStyling: 'Test styling'
      })
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLambdaResponse)
    })

    const request = new MockNextRequest({ productSpec: 'test serum' })
    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.product.name).toBe('TEST SERUM')
    expect(data.product.ingredients).toHaveLength(1)
  })

  it('should handle malformed Lambda JSON response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ response: 'invalid json' })
    })

    const request = new MockNextRequest({ productSpec: 'test serum' })
    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.product.name).toBe('LUMINOUS RENEWAL SERUM') // fallback
  })

  it('should handle Lambda timeout', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Timeout'))

    const request = new MockNextRequest({ productSpec: 'anti-aging serum' })
    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.product).toBeDefined()
  })
})