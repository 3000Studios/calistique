import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SiteFrame from '../components/SiteFrame.jsx'
import AdminLayout from '../components/admin/AdminLayout.jsx'
import HomePage from '../pages/HomePage.jsx'
import AdminLoginPage from '../pages/AdminLoginPage.jsx'
import AdminOperatorPage from '../pages/admin/AdminOperatorPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import { SiteRuntimeProvider } from './SiteRuntimeContext.jsx'
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
    <SiteRuntimeProvider>
      <Routes>
        <Route element={<SiteFrame />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="operator" replace />} />
          <Route path="operator" element={<AdminOperatorPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SiteRuntimeProvider>
  )
}
