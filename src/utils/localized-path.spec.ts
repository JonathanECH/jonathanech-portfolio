import { describe, expect, it } from 'vitest'
import { isEnglishPath, localizedPath } from '@/utils/localized-path'

describe('localized paths', () => {
  it('prefixes Spanish paths only once for English', () => {
    expect(localizedPath('/', 'en')).toBe('/en')
    expect(localizedPath('/proyectos/clima-vue', 'en')).toBe('/en/proyectos/clima-vue')
    expect(localizedPath('/en/proyectos/clima-vue', 'en')).toBe('/en/proyectos/clima-vue')
  })

  it('strips the English prefix back to the canonical Spanish path', () => {
    expect(localizedPath('/en', 'es')).toBe('/')
    expect(localizedPath('/en/proyectos/clima-vue', 'es')).toBe('/proyectos/clima-vue')
    expect(localizedPath('/proyectos/clima-vue', 'es')).toBe('/proyectos/clima-vue')
  })

  it('never treats a Spanish path that merely starts with /en-US as English', () => {
    expect(isEnglishPath('/en')).toBe(true)
    expect(isEnglishPath('/en/proyectos/clima-vue')).toBe(true)
    expect(isEnglishPath('/enough')).toBe(false)
  })
})
