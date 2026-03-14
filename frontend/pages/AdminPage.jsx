import React, { useEffect, useState } from 'react'
import AuroraBackdrop from '../backgrounds/AuroraBackdrop.jsx'
import { getAnalytics, getContent, getDeployments, sendCommand } from '../src/adminApi.js'
import AnalyticsPanel from '../components/admin/AnalyticsPanel.jsx'
import CommandConsole from '../components/admin/CommandConsole.jsx'
import ContentEditor from '../components/admin/ContentEditor.jsx'
import DeploymentPanel from '../components/admin/DeploymentPanel.jsx'

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

export default function AdminPage() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('myappai-api-key') ?? 'local-dev-api-key')
  const [commandText, setCommandText] = useState(defaultCommand)
  const [analytics, setAnalytics] = useState(null)
  const [deployments, setDeployments] = useState(null)
  const [contentBundle, setContentBundle] = useState(null)
  const [commandBusy, setCommandBusy] = useState(false)
  const [editorBusy, setEditorBusy] = useState(false)
  const [deployBusy, setDeployBusy] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [error, setError] = useState('')

  async function refreshDashboard(activeKey = apiKey) {
    if (!activeKey) {
      return
    }

    const [nextAnalytics, nextDeployments, nextContent] = await Promise.all([
      getAnalytics(activeKey),
      getDeployments(activeKey),
      getContent(activeKey)
    ])

    setAnalytics(nextAnalytics)
    setDeployments(nextDeployments)
    setContentBundle(nextContent)
  }

  useEffect(() => {
    localStorage.setItem('myappai-api-key', apiKey)
    refreshDashboard(apiKey).catch((loadError) => setError(loadError.message))
  }, [])

  async function handleRunCommand() {
    try {
      setError('')
      setCommandBusy(true)
      const result = await sendCommand(apiKey, JSON.parse(commandText))
      setLastResult(result)
      await refreshDashboard(apiKey)
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
      const result = await sendCommand(apiKey, {
        action: 'edit_workspace_file',
        targetPath,
        contents,
        autoDeploy: false
      })
      setLastResult(result)
      await refreshDashboard(apiKey)
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
      const result = await sendCommand(apiKey, {
        action: 'deploy_site',
        message: 'Admin-triggered deploy'
      })
      setLastResult(result)
      await refreshDashboard(apiKey)
    } catch (deployError) {
      setError(deployError.message)
    } finally {
      setDeployBusy(false)
    }
  }

  async function handleConnect() {
    try {
      setError('')
      await refreshDashboard(apiKey)
    } catch (connectError) {
      setError(connectError.message)
    }
  }

  return (
    <div className="admin-shell">
      <AuroraBackdrop variant="admin" />
      <header className="admin-header">
        <div>
          <span className="eyebrow">Admin dashboard</span>
          <h1>Revenue and deployment control room</h1>
        </div>
        <div className="admin-auth">
          <input
            type="password"
            placeholder="Bearer API key"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
          />
          <button className="button button--primary" type="button" onClick={handleConnect}>
            Connect
          </button>
        </div>
      </header>

      {error ? <div className="error-banner">{error}</div> : null}

      <div className="admin-grid">
        <AnalyticsPanel analytics={analytics} />
        <DeploymentPanel deployments={deployments} onDeploy={handleDeploy} busy={deployBusy} />
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
