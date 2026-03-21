import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { submitLead, trackConversionEvent } from '../src/siteApi.js'

const INITIAL_FORM = {
  name: '',
  email: '',
  company: '',
  interest: 'Launch Sprint',
  notes: '',
  intent: 'high_intent',
  stage: 'new'
}

export default function ContactLeadForm({
  interestDefault = 'Launch Sprint',
  ctaId = 'contact-form',
  heading = 'Send serious buyers into a real pipeline',
  intro = 'Use this form to qualify the project and capture the next action while the site stays in a lead-form-first mode.',
  submitLabel = 'Submit lead'
}) {
  const location = useLocation()
  const [form, setForm] = useState(INITIAL_FORM)
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  React.useEffect(() => {
    setForm((current) => ({
      ...current,
      interest: interestDefault
    }))
  }, [interestDefault])

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setBusy(true)
      setError('')
      const payload = {
        ...form,
        sourcePath: location.pathname,
        ctaId
      }
      await submitLead(payload)
      await trackConversionEvent('lead_submit', {
        path: location.pathname,
        ctaId,
        offerSlug: form.interest,
        intent: form.intent,
        stage: form.stage,
        details: {
          interest: form.interest
        }
      })
      setSuccess('Lead captured and routed into the real pipeline. Follow-up state is now visible in the admin revenue queue.')
      setForm(INITIAL_FORM)
    } catch (nextError) {
      setError(nextError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section-card">
      <span className="eyebrow">Lead capture</span>
      <h2>{heading}</h2>
      <p className="section-intro">{intro}</p>
      <form className="lead-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input name="name" value={form.name} onChange={updateField} placeholder="Your name" />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@company.com" required />
        </label>
        <label className="field">
          <span>Company</span>
          <input name="company" value={form.company} onChange={updateField} placeholder="Company or brand" />
        </label>
        <label className="field">
          <span>Best-fit offer</span>
          <select name="interest" value={form.interest} onChange={updateField}>
            <option>Operator OS</option>
            <option>Launch Sprint</option>
            <option>Enterprise Deployment</option>
          </select>
        </label>
        <label className="field field--full">
          <span>What outcome do you want?</span>
          <textarea name="notes" rows="5" value={form.notes} onChange={updateField} placeholder="Describe the workflow, launch, or deployment you want help with." />
        </label>
        <div className="checkout-actions">
          <button className="button button--primary" type="submit" disabled={busy}>
            {busy ? 'Sending...' : submitLabel}
          </button>
        </div>
        {success ? <p className="form-success">{success}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
      </form>
    </section>
  )
}
