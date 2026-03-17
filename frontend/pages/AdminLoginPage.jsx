import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PrismEnvironment from '../components/PrismEnvironment.jsx'
import PrismHeadline from '../components/PrismHeadline.jsx'
import { adminNavItems, adminStatusLines, adminTickerItems } from '../src/siteChrome.js'

const SESSION_KEY = 'myappai-admin-session'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim() || !code.trim()) {
      setError('Enter the admin email and passcode to continue.')
      return
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        adminEmail: email.trim(),
        adminCode: code.trim()
      })
    )
    navigate('/admin')
  }

  return (
    <div className="admin-shell">
      <PrismEnvironment
        mode="admin"
        navItems={adminNavItems}
        statusLines={adminStatusLines}
        tickerItems={adminTickerItems}
      />
      <main className="auth-page">
        <section className="auth-card">
          <span className="eyebrow">Admin access</span>
          <PrismHeadline text="Unlock the private control room" />
          <p className="section-intro">
            Use your admin email and passcode to access analytics, deployments, content editing, and command execution.
          </p>
          <form className="stack-md" onSubmit={handleSubmit}>
            <label className="field">
              <span>Admin email</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="mr.jwswain@gmail.com" />
            </label>
            <label className="field">
              <span>Passcode</span>
              <input type="password" value={code} onChange={(event) => setCode(event.target.value)} placeholder="5555" />
            </label>
            <div className="admin-actions">
              <button className="button button--primary" type="submit">
                Enter admin dashboard
              </button>
            </div>
          </form>
          {error ? <div className="error-banner">{error}</div> : null}
        </section>
      </main>
    </div>
  )
}
