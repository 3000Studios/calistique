import React, { useState } from 'react'
import { SUPPORT_EMAIL } from '../src/siteMeta.js'

export default function ContactPage() {
const [submitted, setSubmitted] = useState(false)
const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

function handleChange(e) {
setForm({ ...form, [e.target.name]: e.target.value })
}

function handleSubmit(e) {
e.preventDefault()
const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(form.subject || 'Contact from ' + form.name)}&body=${encodeURIComponent('Name: ' + form.name + '\nEmail: ' + form.email + '\n\n' + form.message)}`
window.location.href = mailto
setSubmitted(true)
}

return (
<article className="prose-page">
  <header className="prose-header">
    <h1>Contact Us</h1>
    <p className="prose-lead">
      We'd love to hear from you. Whether you've spotted an error in an article, have a topic you'd like us to cover, or just want to say hello — every message gets read by a real person on our small editorial team.
    </p>
  </header>

  <section className="prose-section">
    <h2>What to send us</h2>
    <ul>
      <li><b>Corrections</b> — found something wrong? Tell us which page and what's off.</li>
      <li><b>Topic requests</b> — style, planning, or organization topics we haven't covered.</li>
      <li><b>Feedback</b> — tried one of our methods? Tell us how it went.</li>
      <li><b>Business inquiries</b> — advertising, partnership, or press — include "Business" in your subject line.</li>
    </ul>
  </section>

  <section className="prose-section">
    <h2>Get in Touch</h2>
    <p>
      Email us directly at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or use the form below.
    </p>

    {submitted ? (
      <div className="contact-success">
        <p>Thanks! Your email client should have opened. If not, email us directly at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
      </div>
    ) : (
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} placeholder="What's this about?" />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" required rows={6} value={form.message} onChange={handleChange} placeholder="Tell us what you need..." />
        </div>
        <button type="submit" className="button button--primary">Send Message</button>
      </form>
    )}
  </section>

  <section className="prose-section">
    <h2>Response time</h2>
    <p>We aim to respond within 3–5 business days.</p>
  </section>

  <section className="prose-section">
    <h2>Please note</h2>
    <p>Calistique is an informational publication — we can't offer personal styling consultations. We don't accept unsolicited guest posts or paid link placements.</p>
  </section>
</article>
)
}
