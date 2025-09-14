// Tests for Homepage component
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Homepage from '../../src/app/homepage'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

describe('Homepage Component', () => {
  it('should render the main heading', () => {
    render(<Homepage />)
    expect(screen.getByText('Next-Generation')).toBeInTheDocument()
    expect(screen.getByText('Cosmetic Formulation Platform')).toBeInTheDocument()
  })

  it('should display key features', () => {
    render(<Homepage />)

    expect(screen.getByText('AI Formula Generation')).toBeInTheDocument()
    expect(screen.getByText('AI Packaging Design')).toBeInTheDocument()
    expect(screen.getByText('Ready-to-Sell Kits')).toBeInTheDocument()
    expect(screen.getByText('Regulatory Compliance')).toBeInTheDocument()
  })

  it('should have working CTA button', () => {
    render(<Homepage />)

    const ctaButton = screen.getByText('Start Creating Your Formula')
    expect(ctaButton).toBeInTheDocument()
    expect(ctaButton.closest('a')).toHaveAttribute('href', '/generate')
  })

  it('should display platform statistics', () => {
    render(<Homepage />)

    expect(screen.getByText('10,000+')).toBeInTheDocument()
    expect(screen.getByText('Formulas Generated')).toBeInTheDocument()
    expect(screen.getByText('99.9%')).toBeInTheDocument()
    expect(screen.getByText('Success Rate')).toBeInTheDocument()
  })

  it('should show feature descriptions', () => {
    render(<Homepage />)

    expect(screen.getByText(/Generate professional cosmetic formulations/)).toBeInTheDocument()
    expect(screen.getByText(/AI-powered packaging mockups/)).toBeInTheDocument()
    expect(screen.getByText(/Complete product packages/)).toBeInTheDocument()
  })

  it('should have responsive design elements', () => {
    render(<Homepage />)

    // Check for responsive classes
    const heroSection = document.querySelector('.min-h-screen')
    expect(heroSection).toBeInTheDocument()

    const gridLayout = document.querySelector('.grid')
    expect(gridLayout).toBeInTheDocument()
  })

  it('should display branding correctly', () => {
    render(<Homepage />)

    expect(screen.getByText('X FORMULA PLATFORM')).toBeInTheDocument()
    expect(screen.getByText('v2.0')).toBeInTheDocument()
  })

  it('should have accessible navigation', () => {
    render(<Homepage />)

    const nav = document.querySelector('nav')
    expect(nav).toBeInTheDocument()

    const homeLink = screen.getByText('Home')
    const featuresLink = screen.getByText('Features')

    expect(homeLink).toBeInTheDocument()
    expect(featuresLink).toBeInTheDocument()
  })
})