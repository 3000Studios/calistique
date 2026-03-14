import React from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerParent } from '../animations/variants.js'

export default function RichBlocks({ title, intro, items = [] }) {
  return (
    <section className="section-card">
      {title ? <h2>{title}</h2> : null}
      {intro ? <p className="section-intro">{intro}</p> : null}
      <motion.div className="card-grid" variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        {items.map((item) => (
          <motion.article key={item.slug ?? item.title ?? item.heading} className="content-card" variants={fadeUp}>
            <h3>{item.title ?? item.heading ?? item.name}</h3>
            <p>{item.description ?? item.body ?? item.summary}</p>
            {item.bullets ? (
              <ul className="bullet-list">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}
