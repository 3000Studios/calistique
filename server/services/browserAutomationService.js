import { chromium } from 'playwright'

function isBrowserControlEnabled() {
  return !['false', '0', 'off', 'no'].includes(
    String(process.env.BROWSER_CONTROL_ENABLED ?? 'true')
      .trim()
      .toLowerCase()
  )
}

function resolveTargetUrl(url) {
  const trimmed = String(url ?? '').trim()
  if (!trimmed) {
    return 'about:blank'
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function normalizeActions(actions) {
  if (!Array.isArray(actions) || actions.length === 0) {
    throw new Error('A browser action plan is required.')
  }

  return actions.map((action) => ({
    type: String(action?.type ?? '').trim(),
    selector: String(action?.selector ?? '').trim(),
    value: String(action?.value ?? ''),
    key: String(action?.key ?? '').trim(),
    url: String(action?.url ?? '').trim(),
    timeoutMs: Number.isFinite(action?.timeoutMs) ? action.timeoutMs : 1000,
  }))
}

function validateAction(action) {
  const allowed = new Set([
    'goto',
    'click',
    'type',
    'press',
    'wait',
    'screenshot',
    'extract_text',
  ])

  if (!allowed.has(action.type)) {
    throw new Error(`Unsupported browser action "${action.type}".`)
  }
}

export async function runBrowserPlan({ url = '', actions = [], outputPath } = {}) {
  if (!isBrowserControlEnabled()) {
    throw new Error('Browser control is disabled by BROWSER_CONTROL_ENABLED.')
  }

  const browser = await chromium.launch({
    headless: String(process.env.BROWSER_HEADLESS ?? 'true')
      .trim()
      .toLowerCase() !== 'false',
  })

  const page = await browser.newPage()
  const normalizedActions = normalizeActions(actions)
  const results = []

  try {
    if (url) {
      await page.goto(resolveTargetUrl(url), { waitUntil: 'domcontentloaded' })
    }

    for (const action of normalizedActions) {
      validateAction(action)

      if (action.type === 'goto') {
        await page.goto(resolveTargetUrl(action.url), {
          waitUntil: 'domcontentloaded',
        })
        results.push({ type: 'goto', url: page.url() })
        continue
      }

      if (action.type === 'click') {
        await page.click(action.selector)
        results.push({ type: 'click', selector: action.selector })
        continue
      }

      if (action.type === 'type') {
        await page.fill(action.selector, action.value)
        results.push({
          type: 'type',
          selector: action.selector,
          characters: action.value.length,
        })
        continue
      }

      if (action.type === 'press') {
        await page.press(action.selector || 'body', action.key)
        results.push({ type: 'press', key: action.key })
        continue
      }

      if (action.type === 'wait') {
        await page.waitForTimeout(action.timeoutMs)
        results.push({ type: 'wait', timeoutMs: action.timeoutMs })
        continue
      }

      if (action.type === 'screenshot') {
        const targetPath =
          outputPath ?? `C:/GPT/workspace/browser-${Date.now()}.png`
        await page.screenshot({ path: targetPath, fullPage: true })
        results.push({ type: 'screenshot', path: targetPath })
        continue
      }

      if (action.type === 'extract_text') {
        const selector = action.selector || 'body'
        const text = await page.locator(selector).innerText()
        results.push({ type: 'extract_text', selector, text: text.slice(0, 5000) })
      }
    }

    return {
      ok: true,
      url: page.url(),
      title: await page.title(),
      results,
      content: (await page.textContent('body'))?.slice(0, 5000) ?? '',
    }
  } finally {
    await browser.close()
  }
}

