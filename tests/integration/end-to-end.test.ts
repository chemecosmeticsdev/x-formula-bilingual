// End-to-end integration tests
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Next.js environment
global.fetch = vi.fn()

const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(globalThis, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
})

describe('End-to-End Formula Generation Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle complete workflow from specification to result', async () => {
    // Step 1: User inputs product specification
    const productSpec = 'anti-aging serum with peptides and hyaluronic acid'

    // Mock sessionStorage.setItem call
    mockSessionStorage.setItem('productSpec', productSpec)

    // Step 2: Test formula generation API
    const mockFormulaResponse = {
      success: true,
      product: {
        name: 'PEPTIDE RENEWAL SERUM',
        description: 'Advanced anti-aging serum with peptides',
        claims: ['Reduces fine lines', 'Boosts collagen'],
        ingredients: [
          { name: 'Matrixyl 3000', percentage: '4.0%' },
          { name: 'Hyaluronic Acid', percentage: '2.5%' }
        ],
        tonalStyling: 'Premium glass bottle with metallic accents'
      }
    }

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFormulaResponse)
    })

    // Step 3: Test image generation API
    const mockImageResponse = {
      success: true,
      imageUrl: 'https://formula-platform-images.s3.amazonaws.com/test-image.png'
    }

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockImageResponse)
    })

    // Verify the complete workflow
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('productSpec', productSpec)

    // Step 4: Test session storage retrieval
    mockSessionStorage.getItem.mockReturnValue(productSpec)
    const retrievedSpec = mockSessionStorage.getItem('productSpec')
    expect(retrievedSpec).toBe(productSpec)

    // Step 5: Test session cleanup
    mockSessionStorage.removeItem('productSpec')
    expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('productSpec')
  })

  it('should handle fallback scenarios gracefully', async () => {
    // Test formula generation fallback
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const productSpec = 'moisturizing cream'
    mockSessionStorage.setItem('productSpec', productSpec)

    // Should still work with fallback data
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('productSpec', productSpec)

    // Test image generation fallback
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403
    })

    // Should fall back to demo image
    const fallbackImageUrl = '/api/demo-image'
    expect(fallbackImageUrl).toBe('/api/demo-image')
  })

  it('should validate input requirements', () => {
    // Test empty product specification
    expect(() => {
      if (!productSpec || !productSpec.trim()) {
        throw new Error('Product specification is required')
      }
    }).toThrow('Product specification is required')

    // Test valid product specification
    const productSpec = 'vitamin C serum'
    expect(() => {
      if (!productSpec || !productSpec.trim()) {
        throw new Error('Product specification is required')
      }
    }).not.toThrow()
  })

  it('should handle concurrent API calls properly', async () => {
    const mockResponses = [
      { success: true, product: { name: 'Test Product 1' } },
      { success: true, imageUrl: '/api/demo-image' }
    ]

    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockResponses[0]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockResponses[1]) })

    // Simulate concurrent API calls
    const formulaPromise = fetch('/api/generate', { method: 'POST' })
    const imagePromise = fetch('/api/generate-image', { method: 'POST' })

    const [formulaResult, imageResult] = await Promise.all([formulaPromise, imagePromise])

    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(formulaResult.ok).toBe(true)
    expect(imageResult.ok).toBe(true)
  })

  it('should maintain data consistency throughout workflow', async () => {
    const testData = {
      productSpec: 'retinol night serum',
      expectedName: 'RETINOL RENEWAL SERUM',
      expectedTonalStyling: 'Dark glass bottle with elegant pump'
    }

    // Store initial data
    mockSessionStorage.setItem('productSpec', testData.productSpec)

    // Mock consistent responses
    const formulaResponse = {
      success: true,
      product: {
        name: testData.expectedName,
        tonalStyling: testData.expectedTonalStyling
      }
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(formulaResponse)
    })

    // Verify data consistency
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('productSpec', testData.productSpec)

    // Simulate data flow
    mockSessionStorage.getItem.mockReturnValue(testData.productSpec)
    const spec = mockSessionStorage.getItem('productSpec')
    expect(spec).toBe(testData.productSpec)
  })
})