import React from 'react'

const promptPresets = [
  'Rewrite the homepage hero to emphasize deployment and operator workflows.',
  'Tighten the pricing copy so it feels more premium and clearer.',
  'Refresh the contact page to qualify enterprise deployment leads better.'
]

const jsonPresets = [
  {
    label: 'Landing page',
    command: {
      action: 'create_landing_page',
      topic: 'AI automation tools',
      goal: 'generate leads',
      autoDeploy: false
    }
  },
  {
    label: 'Blog post',
    command: {
      action: 'create_blog_post',
      topic: 'AI-powered conversion optimization',
      length: 'medium',
      autoDeploy: false
    }
  },
  {
    label: 'Deploy',
    command: {
      action: 'deploy_site',
      message: 'Admin-triggered deploy'
    }
  }
]

export default function CommandConsole({
  consoleMode,
  onConsoleModeChange,
  commandText,
  onCommandTextChange,
  naturalLanguagePrompt,
  onNaturalLanguagePromptChange,
  onRunCommand,
  busy,
  lastResult
}) {
  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <span className="eyebrow">Custom GPT operator</span>
          <h2>Run natural-language or JSON commands</h2>
        </div>
        <div className="console-mode-switch">
          <button
            className={`pill-button${consoleMode === 'prompt' ? ' pill-button--active' : ''}`}
            type="button"
            onClick={() => onConsoleModeChange('prompt')}
          >
            Natural language
          </button>
          <button
            className={`pill-button${consoleMode === 'json' ? ' pill-button--active' : ''}`}
            type="button"
            onClick={() => onConsoleModeChange('json')}
          >
            Command JSON
          </button>
        </div>
      </div>

      {consoleMode === 'prompt' ? (
        <>
          <div className="preset-row">
            {promptPresets.map((preset) => (
              <button key={preset} className="pill-button" type="button" onClick={() => onNaturalLanguagePromptChange(preset)}>
                {preset}
              </button>
            ))}
          </div>
          <textarea
            className="code-editor code-editor--large"
            spellCheck="false"
            value={naturalLanguagePrompt}
            onChange={(event) => onNaturalLanguagePromptChange(event.target.value)}
          />
          <p className="field-note">
            Natural-language mode targets the live `frontend/` and `content/` app, then deploys only the changed file paths.
          </p>
        </>
      ) : (
        <>
          <div className="preset-row">
            {jsonPresets.map((preset) => (
              <button
                key={preset.label}
                className="pill-button"
                type="button"
                onClick={() => onCommandTextChange(JSON.stringify(preset.command, null, 2))}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <textarea
            className="code-editor code-editor--large"
            spellCheck="false"
            value={commandText}
            onChange={(event) => onCommandTextChange(event.target.value)}
          />
        </>
      )}

      <div className="admin-actions">
        <button className="button button--primary" type="button" onClick={onRunCommand} disabled={busy}>
          {busy ? 'Running...' : consoleMode === 'prompt' ? 'Run custom GPT' : 'Run JSON command'}
        </button>
      </div>
      {lastResult ? <pre className="result-panel">{JSON.stringify(lastResult, null, 2)}</pre> : null}
    </section>
  )
}
