function fromModules(modules) {
  return Object.fromEntries(
    Object.entries(modules)
      .map(([filePath, moduleValue]) => {
        const slug = filePath.split('/').at(-1).replace('.json', '')
        const data = moduleValue.default ?? moduleValue
        return [slug, data]
      })
      .filter(([, data]) => data?.updatedFor === 'myappai')
  )
}

const pages = fromModules(
  import.meta.glob('../../content/pages/*.json', { eager: true })
)
const blog = fromModules(
  import.meta.glob('../../content/blog/*.json', { eager: true })
)
const products = fromModules(
  import.meta.glob('../../content/products/*.json', { eager: true })
)

export const theme = pages.theme ?? {
  palette: {
    bg: '#090d13',
    surface: '#131826',
    ink: '#f5f1ea',
    accent: '#c8a26d',
    highlight: '#f2dfbf',
    line: 'rgba(255,255,255,0.08)',
    glow: 'rgba(200,162,109,0.35)',
    satin: 'rgba(138,170,255,0.16)',
    bronze: '#a96f3d',
    gold: '#d7b36b',
    inkSoft: 'rgba(245,241,234,0.74)',
  },
}

export const homepage = pages.homepage ?? { heroStats: [] }
export const platformPage = pages.platform ?? { items: [] }
export const pricingPage = pages.pricing ?? { tiers: [] }
export const pageLookup = pages
export const blogIndex = blog.index ?? { posts: [] }
export const blogPosts = Object.values(blog)
  .filter((entry) => entry.slug)
  .sort((left, right) =>
    String(right.publishedAt).localeCompare(String(left.publishedAt))
  )
export const blogLookup = Object.fromEntries(
  blogPosts.map((entry) => [entry.slug, entry])
)
export const productCatalog = products.catalog?.products ?? []
export const productLookup = Object.fromEntries(
  Object.values(products)
    .filter((entry) => entry.slug)
    .map((entry) => [entry.slug, entry])
)
