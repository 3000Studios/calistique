import { describe, expect, it } from 'vitest'
import { SITE_DOMAIN, SITE_DISPLAY_NAME, SITE_URL } from './siteMeta.js'

describe('site meta', () => {
  it('uses the Calistique public brand', () => {
    expect(SITE_DISPLAY_NAME).toBe('Calistique')
    expect(SITE_DOMAIN).toBe('calistique.xyz')
    expect(SITE_URL).toBe('https://calistique.xyz')
  })
})
