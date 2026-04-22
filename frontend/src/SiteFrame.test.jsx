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
  it('renders brand and luxury footer content', () => {
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

    expect(screen.getAllByText(/Calistique/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(
      screen.getByText('Elegance redefined for modern luxury commerce.')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Privacy' })).toBeInTheDocument()
  })
})
