import React from 'react'
import { useAdminDashboard } from '../../context/AdminDashboardContext.jsx'

export default function AdminLogsPage() {
  const { logs, metrics, selfHealState, handleSelfHeal } = useAdminDashboard()
  const entries = logs?.entries ?? []

  return (
    <div className="stack-xl">
      <section className="section-card admin-surface ux-reveal">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Operator logs</span>
            <h2>Visible admin logging, healing, and activity review.</h2>
            <p className="section-intro">
              This dashboard keeps a readable stream of operator actions, UI
              events, and healing results so you can see what changed without
              leaving the admin surface.
            </p>
          </div>
          <div className="hero__actions">
            <button
              className="button button--primary"
              type="button"
              onClick={() => void handleSelfHeal()}
            >
              Run self-heal
            </button>
          </div>
        </div>

        <div className="card-grid card-grid--compact">
          <article className="content-card ux-reveal">
            <span className="meta-line">Heal status</span>
            <h3>{selfHealState?.status ?? 'idle'}</h3>
            <p>
              {selfHealState?.warnings?.length
                ? `${selfHealState.warnings.length} warnings currently need review.`
                : 'No active warnings from the latest healing pass.'}
            </p>
          </article>
          <article className="content-card ux-reveal">
            <span className="meta-line">Visible logs</span>
            <h3>{entries.length}</h3>
            <p>Readable activity entries currently stored for the dashboard.</p>
          </article>
          <article className="content-card ux-reveal">
            <span className="meta-line">Operator commands</span>
            <h3>{metrics?.tasks ?? 0}</h3>
            <p>
              Tracked command volume in the current system metrics snapshot.
            </p>
          </article>
        </div>
      </section>

      <section className="section-card admin-surface ux-reveal">
        <span className="eyebrow">Live feed</span>
        <h2>Recent visible events.</h2>
        <div className="log-list">
          {entries.length === 0 ? (
            <article className="log-card ux-reveal">
              <span className="meta-line">No entries yet</span>
              <p>
                The visible log stream will appear here as admin activity runs.
              </p>
            </article>
          ) : (
            entries.map((entry) => (
              <article key={entry.id} className="log-card ux-reveal">
                <div className="log-card__top">
                  <span className="meta-line">
                    {entry.scope} · {entry.level}
                  </span>
                  <span className="meta-line">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3>{entry.title}</h3>
                <p>{entry.message}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
