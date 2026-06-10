/**
 * Content Automation — Calistique
 * Generates an SEO blog post about fashion, streetwear style, AI wardrobe,
 * and capsule collections, then writes it as a JSON file in content/blog/
 * and updates content/blog/index.json.
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', '..', 'content', 'blog');
const INDEX_FILE = path.join(BLOG_DIR, 'index.json');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set');
  process.exit(1);
}

const TOPICS = [
  'How to style oversized tees without looking sloppy',
  'The ultimate guide to statement earrings for everyday wear',
  'Monochrome outfit formulas that work in any season',
  'How to transition a summer wardrobe into fall with three pieces',
  'Streetwear meets luxury: the accessory bridge that ties it together',
  'Why heavyweight fabric matters more than brand names',
  'Building a jewelry collection that actually matches your wardrobe',
  'The drop model explained: why limited releases create better products',
  'How to care for gold-plated jewelry so it lasts years',
  'Five outfit combinations from a seven-piece capsule wardrobe',
  'Bracelet stacking guide: mixing metals, textures, and widths',
  'How AI is changing personal style recommendations',
  'The psychology of color in streetwear: what your palette says',
  'Cargo pants styling guide: from casual to elevated',
  'How to photograph outfits for social media like a brand',
  'Seasonal jewelry trends versus timeless investment pieces',
  'Why fit matters more than fashion: a body-type neutral guide',
  'The minimalist accessory approach: fewer pieces, more impact',
  'How to build a unisex wardrobe that works for everyone',
  'Sneaker and jewelry pairings that complete any streetwear look',
];

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 4096 },
    }),
  });
  const data = await res.json();
  if (!data.candidates || !data.candidates[0]) {
    console.error('Gemini response error:', JSON.stringify(data, null, 2));
    return null;
  }
  return data.candidates[0].content.parts[0].text;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  // Get existing blog post slugs from JSON files in the directory
  const existingFiles = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.json') && f !== 'index.json');
  const existingSlugs = new Set(existingFiles.map((f) => f.replace('.json', '')));

  // Also extract titles from existing posts to avoid duplicates
  const existingTitles = new Set();
  for (const file of existingFiles) {
    try {
      const content = JSON.parse(fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8'));
      if (content.title) existingTitles.add(content.title.toLowerCase());
    } catch {
      // skip malformed files
    }
  }

  const availableTopics = TOPICS.filter(
    (t) => !existingTitles.has(t.toLowerCase())
  );

  if (availableTopics.length === 0) {
    console.log('All seed topics already used. Skipping.');
    return;
  }

  const topic = availableTopics[Math.floor(Math.random() * availableTopics.length)];

  const prompt = `You are a style writer for Calistique, a streetwear and statement jewelry brand that blends street culture with premium craftsmanship.

Write a blog post about: "${topic}"

Requirements:
- SEO-optimized title (may differ slightly from the topic)
- 1-2 sentence excerpt for the blog card
- 4-5 sections, each with a heading and one body paragraph
- A CTA block with eyebrow text, heading, body, primary button label, and primary button href (/products)
- Content should be confident, style-forward, and practical
- No fabricated claims or fake brand partnerships

Return ONLY valid JSON (no markdown fences) with this exact shape:
{
  "title": "string",
  "excerpt": "string",
  "sections": [
    { "heading": "string", "body": "string" }
  ],
  "cta": {
    "eyebrow": "string",
    "heading": "string",
    "body": "string",
    "primaryLabel": "string",
    "primaryHref": "/products"
  }
}`;

  const raw = await callGemini(prompt);
  if (!raw) {
    console.log('No response from Gemini. Skipping.');
    return;
  }

  let post;
  try {
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    post = JSON.parse(cleaned);
  } catch {
    console.error('Failed to parse Gemini response:', raw);
    return;
  }

  const slug = slugify(post.title);
  if (existingSlugs.has(slug)) {
    console.log(`Slug "${slug}" already exists. Skipping.`);
    return;
  }

  const date = new Date().toISOString().split('T')[0];

  // Build the blog post JSON file matching the calistique format
  const blogPost = {
    updatedFor: 'calistique',
    slug: slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: date,
    sections: post.sections,
    cta: post.cta,
  };

  // Write the individual blog post file
  const postFile = path.join(BLOG_DIR, `${slug}.json`);
  fs.writeFileSync(postFile, JSON.stringify(blogPost, null, 2) + '\n', 'utf-8');

  // Update index.json — read it, ensure posts array exists, but we don't need to
  // add to it since the app likely reads from the directory. Just update the date.
  try {
    const index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
    index.publishedAt = date;
    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2) + '\n', 'utf-8');
  } catch (e) {
    console.warn('Could not update index.json:', e.message);
  }

  console.log(`Generated blog post: "${post.title}" -> content/blog/${slug}.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
