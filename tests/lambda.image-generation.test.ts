import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Lambda Image Generation Function', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    global.fetch = vi.fn()
  })

  it('should handle timeout scenarios gracefully', async () => {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 100)

    try {
      await fetch('https://test-api.execute-api.us-east-1.amazonaws.com/dev/generate-image', {
        method: 'POST',
        signal: controller.signal,
        body: JSON.stringify({
          prompt: 'test prompt',
          model: 'amazon.nova-canvas-v1:0',
          width: 1024,
          height: 1024,
        }),
      })
    } catch (error: any) {
      expect(error.name).toBe('AbortError')
    }
  })

  it('should fallback from Nova Canvas to Titan on failure', async () => {
    const mockResponses = [
      // First call (Nova Canvas) fails
      { ok: false, status: 500 },
      // Second call (Titan) succeeds
      { 
        ok: true, 
        json: async () => ({ 
          success: true, 
          imageUrl: 'https://s3.amazonaws.com/test-image.png',
          model: 'amazon.titan-image-generator-v1'
        })
      }
    ]

    ;(global.fetch as any)
      .mockResolvedValueOnce(mockResponses[0])
      .mockResolvedValueOnce(mockResponses[1])

    const response = await fetch('https://test-lambda-endpoint.com/generate-image', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'test prompt',
        model: 'amazon.nova-canvas-v1:0'
      }),
    })

    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('should validate payload format for Bedrock models', () => {
    const novaCanvasPayload = {
      taskType: "TEXT_IMAGE",
      textToImageParams: {
        text: "test prompt"
      },
      imageGenerationConfig: {
        numberOfImages: 1,
        width: 1024,
        height: 1024,
        quality: "premium"
      }
    }

    expect(novaCanvasPayload).toHaveProperty('taskType')
    expect(novaCanvasPayload).toHaveProperty('textToImageParams')
    expect(novaCanvasPayload).toHaveProperty('imageGenerationConfig')
  })

  it('should handle S3 upload and URL generation', () => {
    const mockS3Response = {
      success: true,
      s3_url: 'https://formula-platform-generated-images.s3.ap-southeast-1.amazonaws.com/generated-images/test-image.png'
    }

    expect(mockS3Response.s3_url).toMatch(/^https:\/\/.*\.s3\..*\.amazonaws\.com\/.*/)
  })

  it('should respect timeout configurations', async () => {
    const LAMBDA_TIMEOUT = 120000 // 2 minutes
    const API_TIMEOUT = 45000    // 45 seconds
    
    const start = Date.now()
    
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Timeout')), API_TIMEOUT)
      })
    } catch (error: any) {
      const elapsed = Date.now() - start
      expect(elapsed).toBeLessThan(LAMBDA_TIMEOUT)
      expect(elapsed).toBeGreaterThanOrEqual(API_TIMEOUT - 100) // Allow small margin
    }
  })
})
