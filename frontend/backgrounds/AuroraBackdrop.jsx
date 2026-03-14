import React from 'react'

export default function AuroraBackdrop({ variant = 'marketing' }) {
  return (
    <div className={`aurora aurora--${variant}`} aria-hidden="true">
      <span className="aurora__blob aurora__blob--a" />
      <span className="aurora__blob aurora__blob--b" />
      <span className="aurora__blob aurora__blob--c" />
      <span className="aurora__grid" />
    </div>
  )
}
