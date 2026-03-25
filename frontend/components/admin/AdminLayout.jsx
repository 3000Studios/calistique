import React, { useEffect } from 'react'
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import AdminChrome from './AdminChrome.jsx'
import {
  AdminDashboardProvider,
  useAdminDashboard,
} from '../../context/AdminDashboardContext.jsx'
import { getAdminSession } from '../../src/adminSession.js'
import { SITE_DISPLAY_NAME } from '../../src/siteMeta.js'

const nav = [
  { to: '/admin/operator', label: 'Operator', end: false },
  { to: '/admin/logs', label: 'Logs', end: false },
  { to: '/admin/secure-logs', label: 'Secure Logs', end: false },
]

function AdminLayoutInner() {
  const { adminSession, error, handleRefresh, handleSignOut, handleClientLog } =
    useAdminDashboard()
  const location = useLocation()

  useEffect(() => {
    function handleWindowError(event) {
      void handleClientLog({
        level: 'error',
        title: 'Client runtime error',
        message: event.message ?? 'Unknown client runtime error',
        route: location.pathname,
      })
    }

    function handleUnhandledRejection(event) {
      void handleClientLog({
        level: 'error',
        title: 'Unhandled promise rejection',
        message:
          event.reason instanceof Error
            ? event.reason.message
            : String(event.reason ?? 'Unknown rejection'),
        route: location.pathname,
      })
    }

    window.addEventListener('error', handleWindowError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleWindowError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [handleClientLog, location.pathname])

  return (
    <div className="admin-app">
      <AdminChrome />
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__mark" aria-hidden="true" />
          <div>
            <span className="admin-sidebar__title">{SITE_DISPLAY_NAME}</span>
            <span className="admin-sidebar__subtitle">Operator Workspace</span>
          </div>
        </div>
        <nav className="admin-sidebar__nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' admin-nav-link--active' : ''}`
              }
              end={item.end}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <NavLink className="admin-nav-link admin-nav-link--quiet" to="/">
            View site
          </NavLink>
          <NavLink
            className="admin-nav-link admin-nav-link--quiet"
            to="/admin/login"
          >
            Switch account
          </NavLink>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__titles">
            <span className="eyebrow">Authenticated</span>
            <p className="admin-topbar__email">{adminSession?.adminEmail}</p>
            <strong className="admin-topbar__route">
              {location.pathname.replace('/admin/', '').replace(/-/g, ' ')}
            </strong>
          </div>
          <div className="admin-topbar__actions">
            <button
              className="button button--primary"
              type="button"
              onClick={handleRefresh}
            >
              Sync data
            </button>
            <button
              className="button button--ghost"
              type="button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </header>

        {error ? <div className="error-banner admin-error">{error}</div> : null}

        <div className="admin-outlet">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function AdminGate() {
  const session = getAdminSession()
  if (!session?.adminEmail) {
    return <Navigate to="/admin/login" replace />
  }
  return (
    <AdminDashboardProvider>
      <AdminLayoutInner />
    </AdminDashboardProvider>
  )
}

export default function AdminLayout() {
  return <AdminGate />
}
