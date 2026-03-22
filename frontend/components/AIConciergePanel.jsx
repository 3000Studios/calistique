import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { askPublicAssistant, trackCtaClick } from '../src/siteApi.js'

const QUICK_PROMPTS = [
  'What is the fastest way to book a Camp Dream GA experience?',
  'How should I choose between direct booking and planning support?',
  'What can I buy right now?',
  'How do group retreat inquiries work?',
]

export default function AIConciergePanel() {
  const [history, setHistory] = useState([
    {
      role: 'assistant',
      content:
        'Ask about programs, pricing, booking paths, or planning support. I will route you to the right next step.',
    },
  ])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([
    { label: 'Open pricing', href: '/pricing' },
    { label: 'Talk to the team', href: '/contact' },
  ])

  async function submitPrompt(nextMessage) {
    const trimmedMessage = nextMessage.trim()
    if (!trimmedMessage || loading) {
      return
    }

    const nextHistory = [...history, { role: 'user', content: trimmedMessage }]
    setHistory(nextHistory)
    setMessage('')
    setLoading(true)
    setError('')

    try {
      const response = await askPublicAssistant(trimmedMessage, nextHistory)
      setHistory([
        ...nextHistory,
        { role: 'assistant', content: response.reply },
      ])
      setSuggestions(
        response.suggestions?.length ? response.suggestions : suggestions
      )
    } catch (nextError) {
      setError(nextError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-card assistant-card">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Planning concierge</span>
          <h2>Ask before you book or inquire</h2>
          <p className="section-intro">
            This assistant is wired to the live pricing, program, and site
            context so it can point you toward the best next step.
          </p>
        </div>
        <div className="tag-row">
          {QUICK_PROMPTS.slice(0, 2).map((prompt) => (
            <button
              key={prompt}
              className="pill-button"
              type="button"
              onClick={() => submitPrompt(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="assistant-log" role="log" aria-live="polite">
        {history.map((entry, index) => (
          <article
            key={`${entry.role}-${index}`}
            className={`assistant-message assistant-message--${entry.role}`}
          >
            <span className="meta-line">
              {entry.role === 'assistant' ? 'Assistant' : 'You'}
            </span>
            <p>{entry.content}</p>
          </article>
        ))}
        {loading ? (
          <article className="assistant-message assistant-message--assistant">
            <span className="meta-line">Assistant</span>
            <p>Thinking through the best route...</p>
          </article>
        ) : null}
      </div>

      <form
        className="assistant-input"
        onSubmit={(event) => {
          event.preventDefault()
          submitPrompt(message)
        }}
      >
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows="3"
          placeholder="Ask about programs, pricing, family planning, or group retreats."
        />
        <button
          className="button button--primary"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Ask Camp Dream GA'}
        </button>
      </form>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="assistant-actions">
        {suggestions.map((suggestion) => (
          <Link
            key={`${suggestion.label}-${suggestion.href}`}
            className="button button--ghost"
            to={suggestion.href}
            onClick={() =>
              trackCtaClick({
                ctaId: `assistant-${suggestion.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                intent: 'learn_more',
              }).catch(() => {})
            }
          >
            {suggestion.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
