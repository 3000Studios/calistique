import React, { useEffect, useMemo, useState } from 'react'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default function InteractiveCampScene({
  kicker = 'Camp Dream GA',
  title = 'A brighter, more immersive public experience',
  body = 'A layered scene responds to touch, pointer movement, and device tilt to give the hero area a little more life.',
  chips = [],
  stats = [],
  variant = 'camp',
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let frame = 0

    function updateFromPointer(clientX, clientY) {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const nextY = (clientX / window.innerWidth - 0.5) * 10
        const nextX = -(clientY / window.innerHeight - 0.5) * 10
        setTilt({
          x: clamp(nextX, -6, 6),
          y: clamp(nextY, -6, 6),
        })
      })
    }

    function handlePointerMove(event) {
      updateFromPointer(event.clientX, event.clientY)
    }

    function handleDeviceOrientation(event) {
      const beta = clamp((event.beta ?? 0) / 8, -6, 6)
      const gamma = clamp((event.gamma ?? 0) / 8, -6, 6)
      setTilt({
        x: beta,
        y: gamma,
      })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('deviceorientation', handleDeviceOrientation, {
      passive: true,
    })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
    }
  }, [])

  const sceneStats = useMemo(() => stats.slice(0, 4), [stats])

  return (
    <div
      className={`camp-scene camp-scene--${variant}`}
      style={{
        '--tilt-x': `${tilt.x}deg`,
        '--tilt-y': `${tilt.y}deg`,
      }}
    >
      <div className="camp-scene__starfield" aria-hidden="true" />
      <div
        className="camp-scene__beam camp-scene__beam--a"
        aria-hidden="true"
      />
      <div
        className="camp-scene__beam camp-scene__beam--b"
        aria-hidden="true"
      />
      <div className="camp-scene__mesh" aria-hidden="true" />
      <div
        className="camp-scene__orbit camp-scene__orbit--outer"
        aria-hidden="true"
      />
      <div
        className="camp-scene__orbit camp-scene__orbit--inner"
        aria-hidden="true"
      />

      <div className="camp-scene__content">
        <span className="panel-kicker">{kicker}</span>
        <h3>{title}</h3>
        <p>{body}</p>

        {sceneStats.length ? (
          <div className="camp-scene__rail">
            {sceneStats.map((item) => (
              <article key={item.label} className="camp-scene__stat">
                <span className="meta-line">{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        ) : null}

        {chips.length ? (
          <div className="tag-row">
            {chips.map((chip) => (
              <span key={chip} className="tag">
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
