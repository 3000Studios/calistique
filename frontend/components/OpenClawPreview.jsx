import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './OpenClawPreview.css'

const fallbackRequest = {
  type: 'create_page',
  name: 'Voice to Website',
}

const OpenClawPreview = ({ request, currentRequest, isProcessing, onApprove, onReject }) => {
  const [previewMode, setPreviewMode] = useState('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const activeRequest = request || currentRequest || fallbackRequest

  const previewSizes = {
    desktop: { width: '100%', height: '600px' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' },
  }

  const renderedPreview = useMemo(() => {
    const title = activeRequest.name || 'Voice to Website'
    return (
      <div className="preview-page preview-page--voice">
        <header className="preview-header preview-header--voice">
          <div>
            <p className="preview-kicker">Flagship concept</p>
            <h1>{title}</h1>
          </div>
          <nav className="preview-nav">
            <span>Home</span>
            <span>Blueprints</span>
            <span>Revenue</span>
            <span>Launch</span>
          </nav>
        </header>
        <main className="preview-main">
          <section className="preview-hero">
            <div className="preview-hero__copy">
              <h2>Premium hero video, voice prompt CTA, and real monetization blocks.</h2>
              <p>
                This preview shows a lead-gen homepage with editorial motion,
                premium spacing, and a fast mobile-first layout.
              </p>
              <div className="preview-cta">
                <button className="preview-btn primary">Start with voice</button>
                <button className="preview-btn secondary">Open demo</button>
              </div>
            </div>
            <div className="preview-media">
              <video autoPlay muted loop playsInline preload="metadata">
                <source
                  src="https://cdn.coverr.co/videos/coverr-woman-speaking-on-phone-1555683961140?download=720p"
                  type="video/mp4"
                />
              </video>
            </div>
          </section>
          <section className="preview-features">
            {[
              ['SEO', 'Schema, sitemap, canonical, and structured content'],
              ['Revenue', 'Ads, affiliates, products, and newsletter capture'],
              ['Design', 'Textured gradients, polished type, and motion'],
            ].map(([label, text]) => (
              <div key={label} className="feature-card">
                <h3>{label}</h3>
                <p>{text}</p>
              </div>
            ))}
          </section>
        </main>
        <footer className="preview-footer">
          <p>Ready for review and deployment</p>
        </footer>
      </div>
    )
  }, [activeRequest])

  const currentSize = previewSizes[previewMode]

  return (
    <div className={`openclaw-preview ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="preview-header">
        <h3>🦞 OpenClaw Preview</h3>
        <div className="preview-controls">
          <div className="view-modes">
            <button onClick={() => setPreviewMode('desktop')} className={`mode-btn ${previewMode === 'desktop' ? 'active' : ''}`}>
              Desktop
            </button>
            <button onClick={() => setPreviewMode('tablet')} className={`mode-btn ${previewMode === 'tablet' ? 'active' : ''}`}>
              Tablet
            </button>
            <button onClick={() => setPreviewMode('mobile')} className={`mode-btn ${previewMode === 'mobile' ? 'active' : ''}`}>
              Mobile
            </button>
          </div>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="fullscreen-btn">
            {isFullscreen ? 'Exit' : 'Full'}
          </button>
        </div>
      </div>

      <div className="preview-content">
        <div className="preview-viewport" style={currentSize}>
          <div className="preview-frame">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="preview-processing">
                  <div className="processing-overlay">
                    <div className="processing-content">
                      <div className="claw-icon">🦞</div>
                      <h3>Generating premium homepage preview...</h3>
                      <div className="processing-steps">
                        <div className="step active">Refining layout</div>
                        <div className="step">Adding revenue layers</div>
                        <div className="step">Optimizing SEO</div>
                        <div className="step">Ready for review</div>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="preview" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="preview-rendered">
                  {renderedPreview}
                </motion.div>
              )}
            </AnimatePresence>

            {!isProcessing && (
              <div className="preview-decision">
                <motion.button onClick={onApprove} className="approve-btn" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  Deploy Live
                </motion.button>
                <motion.button onClick={onReject} className="reject-btn" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  Cancel
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="preview-info">
        <div className="request-details">
          <h4>Request Details</h4>
          <div className="detail-item">
            <span className="label">Type</span>
            <span className="value">{activeRequest?.type || 'Unknown'}</span>
          </div>
          <div className="detail-item">
            <span className="label">Name</span>
            <span className="value">{activeRequest?.name || 'Voice to Website'}</span>
          </div>
          <div className="detail-item">
            <span className="label">Status</span>
            <span className={`value status ${isProcessing ? 'processing' : 'ready'}`}>{isProcessing ? 'Processing...' : 'Ready to deploy'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenClawPreview
