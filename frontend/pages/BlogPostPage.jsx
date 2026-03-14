import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { blogLookup } from '../src/siteData.js'

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = blogLookup[slug]

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  return (
    <article className="stack-xl">
      <section className="section-card article-hero">
        <span className="meta-line">{post.publishedAt}</span>
        <h1>{post.title}</h1>
        <p className="section-intro">{post.excerpt}</p>
      </section>

      <section className="stack-lg">
        {post.sections.map((section) => (
          <div key={section.heading} className="article-section">
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </div>
        ))}
      </section>
    </article>
  )
}
