// Integration tests for Thai language detection
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../../src/app/api/generate/route'

// Mock NextRequest
class MockNextRequest {
  constructor(private body: any) {}

  async json() {
    return this.body
  }
}

describe('Thai Language Detection Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock successful responses for all external APIs
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('bedrock')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            product: {
              name: 'Test Product',
              description: 'Test Description',
              claims: ['Test Claim'],
              ingredients: [{ name: 'Test Ingredient', percentage: '1.0%' }],
              tonalStyling: 'Test Styling'
            }
          })
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true })
      })
    })
  })

  it('should detect Thai characters in product specification', async () => {
    const thaiProductSpec = `
      สร้างเซรั่มบำรุงผิวหน้าที่มีส่วนผสมของวิตามินซี และ hyaluronic acid
      สำหรับผิวแพ้ง่าย เหมาะสำหรับใช้ในเวลากลางคืน
      บรรจุภัณฑ์ควรเป็นขวดแก้วสีเขียวเพื่อป้องกันแสง
    `

    const request = new MockNextRequest({
      productSpec: thaiProductSpec
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)

    // Verify that fetch was called with Thai-aware parameters
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: expect.stringContaining('Thai')
      })
    )
  })

  it('should handle English product specification normally', async () => {
    const englishProductSpec = `
      Create an anti-aging serum with vitamin C and hyaluronic acid
      for sensitive skin, suitable for nighttime use.
      Packaging should be in green glass bottle to protect from light.
    `

    const request = new MockNextRequest({
      productSpec: englishProductSpec
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)

    // Verify that fetch was called without Thai-specific parameters
    const fetchCalls = (global.fetch as any).mock.calls
    const bodyContent = fetchCalls[0][1].body
    expect(bodyContent).not.toContain('Thai')
  })

  it('should handle mixed Thai-English content', async () => {
    const mixedProductSpec = `
      Create a serum เซรั่มบำรุง with vitamin C และ hyaluronic acid
      for all skin types เหมาะสำหรับทุกสภาพผิว
    `

    const request = new MockNextRequest({
      productSpec: mixedProductSpec
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)

    // Should be detected as Thai content
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('Thai')
      })
    )
  })

  it('should validate Thai Unicode character range detection', () => {
    const thaiRegex = /[\u0E00-\u0E7F]/

    // Test Thai characters
    expect(thaiRegex.test('ก')).toBe(true) // Thai Ko Kai
    expect(thaiRegex.test('ฮ')).toBe(true) // Thai Ho Nokhuk
    expect(thaiRegex.test('เซรั่ม')).toBe(true) // Thai word "serum"
    expect(thaiRegex.test('บำรุงผิว')).toBe(true) // Thai phrase "skin care"

    // Test non-Thai characters
    expect(thaiRegex.test('serum')).toBe(false) // English
    expect(thaiRegex.test('维生素')).toBe(false) // Chinese
    expect(thaiRegex.test('セラム')).toBe(false) // Japanese
    expect(thaiRegex.test('123')).toBe(false) // Numbers
    expect(thaiRegex.test('!@#')).toBe(false) // Symbols
  })

  it('should handle empty or invalid product specifications', async () => {
    const testCases = [
      { productSpec: '' },
      { productSpec: '   ' },
      { productSpec: null },
      { productSpec: undefined },
      {}
    ]

    for (const testCase of testCases) {
      const request = new MockNextRequest(testCase)
      const response = await POST(request as any)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
    }
  })

  it('should preserve Thai characters in API calls', async () => {
    const thaiText = 'เซรั่มวิตามินซี ไฮยาลูโรนิก'

    const request = new MockNextRequest({
      productSpec: `สร้าง${thaiText}สำหรับผิวแพ้ง่าย`
    })

    await POST(request as any)

    // Verify Thai characters are preserved in the API call
    const fetchCalls = (global.fetch as any).mock.calls
    const bodyContent = fetchCalls[0][1].body
    const parsedBody = JSON.parse(bodyContent)

    expect(parsedBody.prompt).toContain(thaiText)
  })
})