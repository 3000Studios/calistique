import React, { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SiteFrame from '../components/SiteFrame.jsx'
import ExperienceOrchestrator from '../components/ExperienceOrchestrator.jsx'
import HomePage from '../pages/HomePage.jsx'
import { SiteRuntimeProvider } from './SiteRuntimeContext.jsx'
import { theme } from './siteData.js'
import { CartProvider } from './cartStore.jsx'
import '../styles/app.css'
import '../styles/luxury-storefront.css'

// Route-level code splitting: keep the landing page eager for fast first paint,
// lazy-load everything else so the initial bundle stays lean.
const AdminLayout = lazy(() => import('../components/admin/AdminLayout.jsx'))
const ShopItemPage = lazy(() => import('../pages/ShopItemPage.jsx'))
const CollectionPage = lazy(() => import('../pages/CollectionPage.jsx'))
const DropPage = lazy(() => import('../pages/DropPage.jsx'))
const AdsCompliancePage = lazy(() => import('../pages/AdsCompliancePage.jsx'))
const AboutPage = lazy(() => import('../pages/AboutPage.jsx'))
const ContactPage = lazy(() => import('../pages/ContactPage.jsx'))
const PrivacyPage = lazy(() => import('../pages/PrivacyPage.jsx'))
const TermsPage = lazy(() => import('../pages/TermsPage.jsx'))
const DisclosurePage = lazy(() => import('../pages/DisclosurePage.jsx'))
const AdSenseReviewPage = lazy(() => import('../pages/AdSenseReviewPage.jsx'))
const ToolsPage = lazy(() => import('../pages/ToolsPage.jsx'))
const ProductsPage = lazy(() => import('../pages/ProductsPage.jsx'))
const BlogIndexPage = lazy(() => import('../pages/BlogIndexPage.jsx'))
const BlogPostPage = lazy(() => import('../pages/BlogPostPage.jsx'))
const AdminLoginPage = lazy(() => import('../pages/AdminLoginPage.jsx'))
const AdminOperatorPage = lazy(() => import('../pages/admin/AdminOperatorPage.jsx'))
const AdminOpenClawPage = lazy(() => import('../pages/admin/AdminOpenClawPage.jsx'))
const AdminLogsPage = lazy(() => import('../pages/admin/AdminLogsPage.jsx'))
const AdminSecureLogsPage = lazy(() => import('../pages/admin/AdminSecureLogsPage.jsx'))
const OpenClaw = lazy(() => import('../pages/OpenClaw.jsx'))
const RevenueStreams = lazy(() => import('../pages/RevenueStreams.jsx'))
const ReferralZone = lazy(() => import('../pages/ReferralZone.jsx'))
const AdminReferralUpload = lazy(() => import('../pages/AdminReferralUpload.jsx'))
const AccountPage = lazy(() => import('../pages/AccountPage.jsx'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'))
const OrderSuccessPage = lazy(() => import('../pages/OrderSuccessPage.jsx'))
const OrderCancelPage = lazy(() => import('../pages/OrderCancelPage.jsx'))

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite" aria-busy="true">
      <span className="route-fallback__spinner" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

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
    <CartProvider>
      <ExperienceOrchestrator />
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<SiteFrame />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop/:slug" element={<ShopItemPage />} />
          <Route path="/products/:slug" element={<ShopItemPage />} />
          <Route path="/collections/:slug" element={<CollectionPage />} />
          <Route path="/drops/:slug" element={<DropPage />} />
          <Route path="/ads-compliance" element={<AdsCompliancePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/disclosure" element={<DisclosurePage />} />
          <Route path="/adsense-review" element={<AdSenseReviewPage />} />
          <Route path="/menu" element={<ToolsPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/order/success" element={<OrderSuccessPage />} />
          <Route path="/order/cancel" element={<OrderCancelPage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/openclaw" element={<OpenClaw />} />
          <Route path="/revenue" element={<RevenueStreams />} />
          <Route path="/referral/:referralId" element={<ReferralZone />} />
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="operator" replace />} />
          <Route path="operator" element={<AdminOperatorPage />} />
          <Route path="openclaw" element={<AdminOpenClawPage />} />
          <Route path="logs" element={<AdminLogsPage />} />
          <Route path="secure-logs" element={<AdminSecureLogsPage />} />
          <Route path="referral-upload" element={<AdminReferralUpload />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
    </CartProvider>
  </SiteRuntimeProvider>
)
}
