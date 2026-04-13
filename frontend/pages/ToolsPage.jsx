import React, { useState } from 'react'

const MENU = [
  {
    category: 'Signature Dishes',
    items: [
      {
        name: 'Gumbo',
        tagline: 'Deep roux, okra, seafood, and sausage',
        description:
          'A long-form guide that can rank for recipe traffic and carry links to Dutch ovens, spice kits, and meal kits.',
        url: '/blog/gumbo-guide',
        badge: 'Evergreen recipe',
        tags: ['recipe', 'affiliate', 'SEO'],
      },
      {
        name: 'Jambalaya',
        tagline: 'Creole and Cajun styles explained',
        description:
          'Comparison content with ingredient guides and local restaurant specials for readers deciding what to order.',
        url: '/blog/jambalaya-comparison',
        badge: 'High intent',
        tags: ['menu', 'comparison', 'local'],
      },
    ],
  },
  {
    category: 'Money Makers',
    items: [
      {
        name: 'Cast Iron Skillet',
        tagline: 'Cookware affiliate with real utility',
        description:
          'Recommended gear for roux, cornbread, and searing that can earn commission while helping the reader.',
        url: 'https://example.com',
        badge: 'Affiliate',
        tags: ['cookware', 'affiliate', 'home'],
      },
      {
        name: 'Cajun Spice Blend',
        tagline: 'Seasoning product placement',
        description:
          'Spice kit roundups, Amazon-style recommendations, and bundle offers fit naturally on recipe pages.',
        url: 'https://example.com',
        badge: 'Sponsored-ready',
        tags: ['spice', 'product', 'sponsored'],
      },
    ],
  },
]

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', ...MENU.map((g) => g.category)]

  const filtered =
    activeCategory === 'All' ? MENU : MENU.filter((g) => g.category === activeCategory)

  return (
    <article className="prose-page tools-page">
      <header className="prose-header">
        <h1>Cajun Menu and Deal Directory</h1>
        <p className="prose-lead">
          A curated set of Cajun recipes, local menu guides, and revenue-ready
          recommendations built to attract search traffic and clicks.
        </p>
      </header>

      <nav className="tools-filter" aria-label="Filter by category">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tools-filter__btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      {filtered.map((group) => (
        <section key={group.category} className="tools-group">
          <h2>{group.category}</h2>
          <div className="tools-grid">
            {group.items.map((tool) => (
              <div key={tool.name} className="tool-card">
                <div className="tool-card__header">
                  <h3>{tool.name}</h3>
                  <span className="tool-card__badge">{tool.badge}</span>
                </div>
                <p className="tool-card__tagline">{tool.tagline}</p>
                <p className="tool-card__desc">{tool.description}</p>
                <div className="tool-card__tags">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="tool-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={tool.url}
                  className="button button--primary tool-card__cta"
                  rel={tool.url.startsWith('http') ? 'noopener noreferrer sponsored' : undefined}
                >
                  Open {tool.name} →
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="prose-section tools-disclosure">
        <p>
          Disclosure: some links may be affiliate or sponsored placements. We
          only keep recommendations that fit the recipe or menu guide.
        </p>
      </section>
    </article>
  )
}
