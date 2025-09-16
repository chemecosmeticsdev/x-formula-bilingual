// Integration tests for environment variable timing issues
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST } from '../../src/app/api/generate-image/route'

// Mock NextRequest
class MockNextRequest {
  constructor(private body: any) {}

  async json() {
    return this.body
  }
}

describe('Environment Variable Timing Tests', () => {
  let originalEnv: NodeJS.ProcessEnv
  let originalFetch: typeof global.fetch

  beforeEach(() => {
    originalEnv = process.env
    originalFetch = global.fetch
    vi.clearAllMocks()
  })

  afterEach(() => {
    process.env = originalEnv
    global.fetch = originalFetch
  })

  it('should handle missing environment variable gracefully', async () => {
    // Simulate missing environment variable
    process.env = { ...originalEnv }
    delete process.env.LAMBDA_BEDROCK_IMAGE_ENDPOINT

    const request = new MockNextRequest({
      productName: 'Test Serum',
      tonalStyling: 'Premium glass bottle',
      productType: 'serum'
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.imageUrl).toContain('/api/demo-image')
  })

  it('should work when environment variable is present', async () => {
    // Set environment variable
    process.env.LAMBDA_BEDROCK_IMAGE_ENDPOINT = 'https://test-lambda-endpoint.com'

    // Mock successful Lambda response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        imageUrl: 'https://test-s3-url.com/image.png'
      })
    })

    const request = new MockNextRequest({
      productName: 'Test Serum',
      tonalStyling: 'Premium glass bottle',
      productType: 'serum'
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.imageUrl).toBe('https://test-s3-url.com/image.png')
    expect(global.fetch).toHaveBeenCalledWith(
      'https://test-lambda-endpoint.com',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    )
  })

  it('should test timing-sensitive environment variable access', async () => {
    // Simulate delayed environment variable availability
    let envAccessCount = 0
    const originalProcess = process

    Object.defineProperty(global, 'process', {
      value: {
        ...originalProcess,
        env: new Proxy(originalEnv, {
          get(target, prop) {
            if (prop === 'LAMBDA_BEDROCK_IMAGE_ENDPOINT') {
              envAccessCount++
              // First access returns undefined, second access returns value
              return envAccessCount === 1 ? undefined : 'https://test-lambda-endpoint.com'
            }
            return target[prop as keyof NodeJS.ProcessEnv]
          }
        })
      },
      configurable: true
    })

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        imageUrl: 'https://test-s3-url.com/image.png'
      })
    })

    const request = new MockNextRequest({
      productName: 'Test Serum',
      tonalStyling: 'Premium glass bottle',
      productType: 'serum'
    })

    const response = await POST(request as any)
    const data = await response.json()

    // The debugging code should have accessed env variable multiple times
    expect(envAccessCount).toBeGreaterThan(1)

    // Clean up
    Object.defineProperty(global, 'process', {
      value: originalProcess,
      configurable: true
    })
  })

  it('should validate the debugging code timing fix', async () => {
    process.env.LAMBDA_BEDROCK_IMAGE_ENDPOINT = 'https://test-lambda-endpoint.com'

    // Track timing of environment variable accesses
    const accessTimes: number[] = []
    const originalEnvGetter = Object.getOwnPropertyDescriptor(process, 'env')?.get

    Object.defineProperty(process, 'env', {
      get() {
        const env = new Proxy(originalEnv, {
          get(target, prop) {
            if (prop === 'LAMBDA_BEDROCK_IMAGE_ENDPOINT') {
              accessTimes.push(Date.now())
            }
            return target[prop as keyof NodeJS.ProcessEnv]
          }
        })
        return env
      },
      configurable: true
    })

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        imageUrl: 'https://test-s3-url.com/image.png'
      })
    })

    const request = new MockNextRequest({
      productName: 'Test Serum',
      tonalStyling: 'Premium glass bottle',
      productType: 'serum'
    })

    const startTime = Date.now()
    await POST(request as any)
    const endTime = Date.now()

    // Verify multiple environment variable accesses due to debugging code
    expect(accessTimes.length).toBeGreaterThan(1)

    // Verify timing - debugging should introduce small delay
    expect(endTime - startTime).toBeGreaterThan(0)

    // Restore original getter
    if (originalEnvGetter) {
      Object.defineProperty(process, 'env', {
        get: originalEnvGetter,
        configurable: true
      })
    }
  })

  it('should test concurrent request behavior', async () => {
    process.env.LAMBDA_BEDROCK_IMAGE_ENDPOINT = 'https://test-lambda-endpoint.com'

    let fetchCallCount = 0
    global.fetch = vi.fn().mockImplementation(() => {
      fetchCallCount++
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          imageUrl: `https://test-s3-url.com/image-${fetchCallCount}.png`
        })
      })
    })

    const request1 = new MockNextRequest({
      productName: 'Test Serum 1',
      tonalStyling: 'Glass bottle',
      productType: 'serum'
    })

    const request2 = new MockNextRequest({
      productName: 'Test Serum 2',
      tonalStyling: 'Plastic bottle',
      productType: 'cream'
    })

    // Test concurrent requests
    const [response1, response2] = await Promise.all([
      POST(request1 as any),
      POST(request2 as any)
    ])

    const data1 = await response1.json()
    const data2 = await response2.json()

    expect(data1.success).toBe(true)
    expect(data2.success).toBe(true)
    expect(data1.imageUrl).toContain('test-s3-url.com')
    expect(data2.imageUrl).toContain('test-s3-url.com')
    expect(fetchCallCount).toBe(2)
  })
})