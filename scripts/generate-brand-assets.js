// One-shot brand asset generator: rasterizes branded SVGs into the PNGs that
// social platforms and iOS require (they do not reliably render SVG). Outputs
// to frontend/public so Vite copies them into dist on build.
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '..', 'frontend', 'public')

const GOLD_STOPS = `
  <stop offset="0" stop-color="#e7c878"/>
  <stop offset="0.5" stop-color="#c9a24b"/>
  <stop offset="1" stop-color="#9c7a2e"/>
`

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1018"/>
      <stop offset="1" stop-color="#05070b"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">${GOLD_STOPS}</linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.32" r="0.6">
      <stop offset="0" stop-color="#c9a24b" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#c9a24b" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="28" y="28" width="1144" height="574" rx="20" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.55"/>
  <text x="600" y="262" text-anchor="middle" font-family="'Times New Roman', Georgia, serif"
        font-size="120" font-weight="600" letter-spacing="10" fill="url(#gold)">CALISTIQUE</text>
  <text x="600" y="340" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif"
        font-size="34" letter-spacing="8" fill="#e8ecf2">LUXURY FASHION &amp; FINE JEWELLERY</text>
  <line x1="500" y1="392" x2="700" y2="392" stroke="url(#gold)" stroke-width="2"/>
  <text x="600" y="470" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif"
        font-size="23" letter-spacing="3.5" fill="#9aa3b2">ELEVATED ESSENTIALS · STATEMENT PIECES · SECURE CHECKOUT</text>
  <text x="600" y="556" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif"
        font-size="24" letter-spacing="4" fill="#c9a24b">calistique.xyz</text>
</svg>`

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">${GOLD_STOPS}</linearGradient></defs>
  <rect width="64" height="64" rx="14" fill="#090d13"/>
  <rect x="1.5" y="1.5" width="61" height="61" rx="12.5" fill="none" stroke="url(#g)" stroke-width="1.5" opacity="0.6"/>
  <text x="32" y="33" text-anchor="middle" dominant-baseline="central"
        font-family="'Times New Roman', Georgia, serif" font-size="40" font-weight="600" fill="url(#g)">C</text>
</svg>`

async function main() {
  await mkdir(publicDir, { recursive: true })
  await sharp(Buffer.from(ogSvg)).png({ quality: 90 }).toFile(path.join(publicDir, 'og-image.png'))
  await sharp(Buffer.from(iconSvg)).png().toFile(path.join(publicDir, 'apple-touch-icon.png'))
  await sharp(Buffer.from(iconSvg)).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32.png'))
  console.log('Generated og-image.png (1200x630), apple-touch-icon.png (180x180), favicon-32.png')
}

main().catch((err) => {
  console.error('Brand asset generation failed:', err)
  process.exit(1)
})
