import React from 'react'
import { Link } from 'react-router-dom'
import InteractiveCampScene from '../components/InteractiveCampScene.jsx'
import PrismHeadline from '../components/PrismHeadline.jsx'
import RichBlocks from '../components/RichBlocks.jsx'
import { trackCtaClick } from '../src/siteApi.js'
import { pageLookup } from '../src/siteData.js'

export default function ProductsPage() {
  const pageCards = [
    { slug: 'summer-camp', ctaLabel: 'Explore Summer Camp' },
    { slug: 'camp-out', ctaLabel: 'See Camp Out' },
    { slug: 'what-we-do', ctaLabel: 'Read What We Do' },
    { slug: 'location', ctaLabel: 'View Location' },
    { slug: 'faq', ctaLabel: 'Open FAQ' },
    { slug: 'team', ctaLabel: 'Meet the Team' },
    { slug: 'volunteer', ctaLabel: 'Volunteer' },
    { slug: 'donate', ctaLabel: 'Donate' },
  ]
    .map((entry) => {
      const page = pageLookup[entry.slug]

      if (!page) {
        return null
      }

      return {
        eyebrow: page.eyebrow,
        title: page.headline,
        description: page.subheadline,
        ctaLabel: entry.ctaLabel,
        ctaHref: `/${entry.slug}`,
      }
    })
    .filter(Boolean)

  return (
    <div className="stack-2xl">
      <section className="section-card section-card--hero product-hero">
        <div className="product-hero__content stack-lg">
          <span className="eyebrow">Programs and pathways</span>
          <PrismHeadline text="Explore the camp experiences and support paths that shape the year" />
          <p className="section-intro">
            This hub pulls together the core ways families, volunteers, and
            supporters engage with Camp Dream GA: Summer Camp, Camp Out, mission
            details, volunteer service, and giving.
          </p>
          <div className="tag-row">
            <span className="tag">Summer Camp</span>
            <span className="tag">Camp Out</span>
            <span className="tag">Volunteer + Donate</span>
          </div>
        </div>

        <aside className="product-hero__aside stack-md">
          <InteractiveCampScene
            kicker="Explore the site"
            title="The original information architecture, rebuilt for a more modern mobile-first experience"
            body="This hub now mirrors the public paths people expect from Camp Dream GA while keeping a stronger sense of motion, hierarchy, and visual polish."
            chips={[
              'Programs',
              'Planning pages',
              'Team and stories',
              'Volunteer + donate',
            ]}
            stats={[
              { label: 'Public paths', value: 'Camp + support' },
              { label: 'Priority', value: 'Clarity first' },
              { label: 'Design goal', value: 'Brighter + raised' },
            ]}
          />
        </aside>
      </section>

      <RichBlocks
        title="Explore the camp ecosystem"
        intro="Each page serves a different job: some explain the camp experience, some answer practical questions, and some help supporters take action."
        items={pageCards}
      />

      <section className="section-card conversion-band">
        <div>
          <span className="eyebrow">Decision helper</span>
          <h2>
            Start with Summer Camp if you are exploring participation, or jump
            to Donate if you are ready to support the mission.
          </h2>
          <p className="section-intro">
            This public experience is designed to answer questions first, then
            guide people into the right next step without overwhelming them.
          </p>
        </div>
        <div className="hero__actions">
          <Link
            className="button button--primary"
            to="/summer-camp"
            onClick={() =>
              trackCtaClick({
                ctaId: 'products-summer-camp',
                intent: 'learn_more',
              }).catch(() => {})
            }
          >
            Explore Summer Camp
          </Link>
          <Link
            className="button button--ghost"
            to="/donate"
            onClick={() =>
              trackCtaClick({
                ctaId: 'products-donate',
                intent: 'learn_more',
              }).catch(() => {})
            }
          >
            Support Camp Dream
          </Link>
        </div>
      </section>
    </div>
  )
}
