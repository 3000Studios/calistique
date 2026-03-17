import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import PrismEnvironment from '../components/PrismEnvironment.jsx'
import PrismHeadline from '../components/PrismHeadline.jsx'
import { getAnalytics, getContent, getDeployments, sendCommand } from '../src/adminApi.js'
import AnalyticsPanel from '../components/admin/AnalyticsPanel.jsx'
import CommandConsole from '../components/admin/CommandConsole.jsx'
import ContentEditor from '../components/admin/ContentEditor.jsx'
import DeploymentPanel from '../components/admin/DeploymentPanel.jsx'
import TrafficPanel from '../components/admin/TrafficPanel.jsx'
import { adminNavItems, adminStatusLines, adminTickerItems } from '../src/siteChrome.js'

const defaultCommand = JSON.stringify(
  {
    action: 'create_blog_post',
    topic: 'AI automation',
    length: 'medium',
    autoDeploy: false
  },
  null,
  2
)

const SESSION_KEY = 'myappai-admin-session'

export default function AdminPage() {
  const [adminSession] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [commandText, setCommandText] = useState(defaultCommand)
  const [analytics, setAnalytics] = useState(null)
  const [deployments, setDeployments] = useState(null)
  const [contentBundle, setContentBundle] = useState(null)
  const [commandBusy, setCommandBusy] = useState(false)
  const [editorBusy, setEditorBusy] = useState(false)
  const [deployBusy, setDeployBusy] = useState(false)
  const [trafficBusy, setTrafficBusy] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [error, setError] = useState('')

  async function refreshDashboard(activeSession = adminSession) {
    if (!activeSession?.adminEmail || !activeSession?.adminCode) {
      return
    }

    const [nextAnalytics, nextDeployments, nextContent] = await Promise.all([
      getAnalytics(activeSession),
      getDeployments(activeSession),
      getContent(activeSession)
    ])

    setAnalytics(nextAnalytics)
    setDeployments(nextDeployments)
    setContentBundle(nextContent)
  }

  useEffect(() => {
    refreshDashboard(adminSession).catch((loadError) => setError(loadError.message))
  }, [])

  async function handleRunCommand() {
    try {
      setError('')
      setCommandBusy(true)
      const result = await sendCommand(adminSession, JSON.parse(commandText))
      setLastResult(result)
      await refreshDashboard(adminSession)
    } catch (runError) {
      setError(runError.message)
    } finally {
      setCommandBusy(false)
    }
  }

  async function handleSaveFile(targetPath, contents) {
    try {
      setError('')
      setEditorBusy(true)
      const result = await sendCommand(adminSession, {
        action: 'edit_workspace_file',
        targetPath,
        contents,
        autoDeploy: false
      })
      setLastResult(result)
      await refreshDashboard(adminSession)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setEditorBusy(false)
    }
  }

  async function handleDeploy() {
    try {
      setError('')
      setDeployBusy(true)
      const result = await sendCommand(adminSession, {
        action: 'deploy_site',
        message: 'Admin-triggered deploy'
      })
      setLastResult(result)
      await refreshDashboard(adminSession)
    } catch (deployError) {
      setError(deployError.message)
    } finally {
      setDeployBusy(false)
    }
  }

  async function handleConnect() {
    try {
      setError('')
      await refreshDashboard(adminSession)
    } catch (connectError) {
      setError(connectError.message)
    }
  }

  async function handleDiscoverTopics() {
    try {
      setError('')
      setTrafficBusy(true)
      const result = await sendCommand(adminSession, {
        action: 'discover_topics',
        limit: 6
      })
      setLastResult(result)
      await refreshDashboard(adminSession)
    } catch (trafficError) {
      setError(trafficError.message)
    } finally {
      setTrafficBusy(false)
    }
  }

  async function handleRunTrafficCycle() {
    try {
      setError('')
      setTrafficBusy(true)
      const result = await sendCommand(adminSession, {
        action: 'run_traffic_cycle',
        count: 2,
        includeImages: true,
        autoDeploy: false
      })
      setLastResult(result)
      await refreshDashboard(adminSession)
    } catch (trafficError) {
      setError(trafficError.message)
    } finally {
      setTrafficBusy(false)
    }
  }

  function handleSignOut() {
    localStorage.removeItem(SESSION_KEY)
    window.location.href = '/admin/login'
  }

  if (!adminSession?.adminEmail || !adminSession?.adminCode) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="admin-shell">
      <PrismEnvironment
        mode="admin"
        navItems={adminNavItems}
        statusLines={adminStatusLines}
        tickerItems={adminTickerItems}
      />
      <header className="admin-header">
        <div>
          <span className="eyebrow">Admin dashboard</span>
          <PrismHeadline text="Revenue and deployment control room" />
        </div>
        <div className="admin-auth">
          <button className="button button--primary" type="button" onClick={handleConnect}>
            Refresh
          </button>
          <button className="button button--ghost" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>

      {error ? <div className="error-banner">{error}</div> : null}

      <div className="admin-grid">
        <AnalyticsPanel analytics={analytics} />
        <DeploymentPanel deployments={deployments} onDeploy={handleDeploy} busy={deployBusy} />
        <TrafficPanel
          analytics={analytics}
          contentBundle={contentBundle}
          onDiscoverTopics={handleDiscoverTopics}
          onRunTrafficCycle={handleRunTrafficCycle}
          busy={trafficBusy}
        />
        <CommandConsole
          commandText={commandText}
          onCommandTextChange={setCommandText}
          onRunCommand={handleRunCommand}
          busy={commandBusy}
          lastResult={lastResult}
        />
        <ContentEditor contentBundle={contentBundle} onSaveFile={handleSaveFile} busy={editorBusy} />
      </div>
    </div>
  )
}
