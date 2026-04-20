import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import SiteFrame from '../components/SiteFrame.jsx'
import { CartProvider } from './cartStore.jsx'

vi.mock('../src/siteApi.js', () => ({
  trackConversionEvent: vi.fn(() => Promise.resolve()),
}))

describe('SiteFrame', () => {
  it('renders brand, footer trust copy and global ticker', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<SiteFrame />}>
              <Route path="/" element={<h1>Home</h1>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    expect(screen.getAllByText('Calistique').length).toBeGreaterThan(0)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByText('Loading live data...')).toBeInTheDocument()
  })
})
