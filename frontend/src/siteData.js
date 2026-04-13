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
    bg: '#0f0d0c',
    surface: '#191614',
    ink: '#f7f1ea',
    accent: '#d7b98b',
    highlight: '#f3e6d4',
    line: 'rgba(255,255,255,0.1)',
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
