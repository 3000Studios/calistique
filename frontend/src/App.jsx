import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import SiteFrame from '../components/SiteFrame.jsx'
import HomePage from '../pages/HomePage.jsx'
import BlogPage from '../pages/BlogPage.jsx'
import BlogPostPage from '../pages/BlogPostPage.jsx'
import ProductsPage from '../pages/ProductsPage.jsx'
import ProductPage from '../pages/ProductPage.jsx'
import GenericPage from '../pages/GenericPage.jsx'
import AdminPage from '../pages/AdminPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import { theme } from './siteData.js'
import '../styles/app.css'

function applyTheme(themeConfig) {
  const palette = themeConfig.palette ?? {}

  for (const [key, value] of Object.entries(palette)) {
    document.documentElement.style.setProperty(`--${key}`, value)
  }
}

export default function App() {
  useEffect(() => {
    applyTheme(theme)
  }, [])

  return (
    <Routes>
      <Route element={<SiteFrame />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/:slug" element={<GenericPage />} />
      </Route>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
