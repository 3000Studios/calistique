import React from 'react'
import { useAdminDashboard } from '../../context/AdminDashboardContext.jsx'

const quickPrompts = [
  'Update site metadata canonical URL to myappai.net',
  'Scan the active runtime for any remaining legacy branding and replace it with MyAppAI',
  'Audit the workspace for risky shell requests and explain the safe boundary',
  'Refresh the homepage copy for SaaS founders and prepare deployment',
]

export default function AdminOperatorPage() {
  const {
    naturalLanguagePrompt,
    setNaturalLanguagePrompt,
    handleRunCommand,
    commandBusy,
    operatorHistory,
    analytics,
    deployments,
    error,
  } = useAdminDashboard()

  const latestDeployment = deployments?.history?.[0] ?? null
  const latestPaths = operatorHistory[0]?.affectedPaths ?? []

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleRunCommand()
    }
  }

  return (
    <div className="operator-page">
      <aside className="operator-rail" aria-label="Operator sections">
        <div className="operator-logo">M</div>
        <div className="operator-rail__stack">
          <button
            className="operator-rail__item operator-rail__item--active"
            type="button"
            aria-label="Workspace"
          >
            <span />
          </button>
          <button
            className="operator-rail__item"
            type="button"
            aria-label="Results"
          >
            <span />
          </button>
          <button
            className="operator-rail__item"
            type="button"
            aria-label="Deployments"
          >
            <span />
          </button>
        </div>
      </aside>

      <div className="operator-shell">
        <header className="operator-header">
          <div className="operator-breadcrumb">
            <span>MyAppAI</span>
            <span>/</span>
            <span>Operator Workspace</span>
          </div>
          <div className="operator-header__status">
            <span className="operator-status-pill">
              <span className="operator-status-dot" />
              PROD: MYAPPAI.NET
            </span>
            <span className="operator-status-pill">VOICE: PHASED NEXT</span>
          </div>
        </header>

        <section className="operator-workspace">
          <div className="operator-monolith">
            <div className="operator-monolith__header">
              <span className="operator-label">Command Interface</span>
              <span className="operator-label operator-label--quiet">
                Safe repo + deploy control
              </span>
            </div>

            <div className="operator-prompt">
              <textarea
                id="promptInput"
                value={naturalLanguagePrompt}
                onChange={(event) =>
                  setNaturalLanguagePrompt(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Describe the site change or orchestration task..."
              />
              <div className="operator-prompt__actions">
                <button
                  className="btn-primary"
                  type="button"
                  id="sendBtn"
                  onClick={() => void handleRunCommand()}
                  disabled={commandBusy}
                >
                  {commandBusy ? 'RUNNING' : 'EXECUTE'}
                </button>
              </div>
            </div>

            <div className="operator-chips">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  className="operator-chip"
                  type="button"
                  onClick={() => setNaturalLanguagePrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="operator-results">
            {error ? (
              <article className="operator-result-card operator-result-card--blocked">
                <header className="operator-result-card__header">
                  <span className="operator-label">Operator error</span>
                  <span className="operator-result-card__status">blocked</span>
                </header>
                <div className="operator-result-card__body">{error}</div>
              </article>
            ) : null}

            {operatorHistory.length === 0 ? (
              <article className="operator-result-card">
                <header className="operator-result-card__header">
                  <span className="operator-label">Workspace status</span>
                  <span className="operator-result-card__status">ready</span>
                </header>
                <div className="operator-result-card__body">
                  &gt; Type a request and press Enter to execute. The operator
                  will summarize the mode, changed paths, sources, and
                  deployment status here.
                </div>
              </article>
            ) : null}

            {operatorHistory.map((result, index) => (
              <article
                key={`${result.summary ?? result.mode ?? 'result'}-${index}`}
                className={`operator-result-card${
                  result.status === 'blocked'
                    ? ' operator-result-card--blocked'
                    : ''
                }`}
              >
                <header className="operator-result-card__header">
                  <span className="operator-label">
                    {index === 0 ? 'Latest action' : 'Previous action'}
                  </span>
                  <span className="operator-result-card__status">
                    {result.status ?? 'unknown'}
                  </span>
                </header>
                <div className="operator-result-card__body">
                  <div>&gt; {result.summary ?? 'No summary returned.'}</div>
                  <div>Mode: {result.mode ?? 'unknown'}</div>
                  {result.affectedPaths?.length ? (
                    <div>Paths: {result.affectedPaths.join(', ')}</div>
                  ) : null}
                  {result.sources?.length ? (
                    <div>
                      Sources:{' '}
                      {result.sources
                        .map((item) => item.title ?? item.url)
                        .join(' | ')}
                    </div>
                  ) : null}
                  {result.blockedReason ? (
                    <div className="operator-result-card__blocked">
                      {result.blockedReason}
                    </div>
                  ) : null}
                  {result.deployment?.status ? (
                    <div>Deploy: {result.deployment.status}</div>
                  ) : null}
                  {result.nextSteps?.length ? (
                    <div>Next: {result.nextSteps.join(' | ')}</div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="operator-inspector">
          <section className="operator-panel">
            <div className="operator-section-title">Workspace bounds</div>
            <ul className="operator-file-list">
              {[
                'frontend/src/',
                'frontend/pages/',
                'frontend/styles/',
                'content/pages/',
                'content/system/',
              ].map((item) => (
                <li key={item} className="operator-file-item">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="operator-panel">
            <div className="operator-section-title">Deployment pulse</div>
            <div className="operator-pulse">
              <div className="operator-pulse__wave" />
              <div className="operator-pulse__content">
                <strong>{latestDeployment?.status ?? 'idle'}</strong>
                <span>
                  {latestDeployment?.finishedAt
                    ? new Date(latestDeployment.finishedAt).toLocaleString()
                    : 'No recent deployment'}
                </span>
              </div>
            </div>
          </section>

          <section className="operator-panel">
            <div className="operator-section-title">System metrics</div>
            <div className="operator-stat-grid">
              <div className="operator-stat-box">
                <span className="operator-stat-label">Commands</span>
                <span className="operator-stat-value">
                  {analytics?.aiActivity?.commandsToday ?? 0}
                </span>
              </div>
              <div className="operator-stat-box">
                <span className="operator-stat-label">Deploys</span>
                <span className="operator-stat-value">
                  {analytics?.aiActivity?.deploymentsToday ?? 0}
                </span>
              </div>
              <div className="operator-stat-box">
                <span className="operator-stat-label">Last action</span>
                <span className="operator-stat-value">
                  {analytics?.aiActivity?.lastAction ?? 'idle'}
                </span>
              </div>
              <div className="operator-stat-box">
                <span className="operator-stat-label">Changed files</span>
                <span className="operator-stat-value">
                  {latestPaths.length}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
