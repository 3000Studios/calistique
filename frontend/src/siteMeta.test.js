import { describe, expect, it } from 'vitest'
import { SITE_DOMAIN, SITE_DISPLAY_NAME, SITE_URL } from './siteMeta.js'

describe('site meta', () => {
  it('uses the Camp Dream GA public brand', () => {
    expect(SITE_DISPLAY_NAME).toBe('Camp Dream GA')
    expect(SITE_DOMAIN).toBe('campdreamga.com')
    expect(SITE_URL).toBe('https://campdreamga.com')
  })
})
