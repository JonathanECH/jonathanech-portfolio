import { describe, expect, it } from 'vitest'
import { enMessages } from '@/i18n/messages/en'
import { esMessages } from '@/i18n/messages/es'
import { translate } from '@/i18n'
import { enContent, esContent } from '@/i18n/content'

describe('i18n dictionaries', () => {
  it('keeps the same keys in Spanish and English', () => {
    expect(Object.keys(enMessages).sort()).toEqual(Object.keys(esMessages).sort())
  })

  it('has no empty messages', () => {
    for (const messages of [esMessages, enMessages]) {
      for (const [key, value] of Object.entries(messages)) {
        expect(value.trim(), key).not.toBe('')
      }
    }
  })

  it('interpolates parameters and falls back to the key', () => {
    expect(translate(esMessages, 'projects.quickViewAria', { name: 'TilyShop' })).toBe(
      'Vista rápida: TilyShop',
    )
    expect(translate(enMessages, 'projects.quickViewAria', { name: 'TilyShop' })).toBe(
      'Quick view: TilyShop',
    )
    expect(translate(esMessages, 'missing.key')).toBe('missing.key')
  })
})

describe('localized content', () => {
  it('keeps the same project and technology identities in both locales', () => {
    expect(enContent.projects.map((project) => project.slug)).toEqual(
      esContent.projects.map((project) => project.slug),
    )
    expect(enContent.technologies.map((tech) => tech.id)).toEqual(
      esContent.technologies.map((tech) => tech.id),
    )
  })

  it('keeps the expected content shape', () => {
    for (const content of [esContent, enContent]) {
      expect(content.projects).toHaveLength(3)
      expect(content.technologies).toHaveLength(23)
      expect(content.technologies.filter((tech) => tech.category === 'frontend')).toHaveLength(8)
      expect(content.technologies.filter((tech) => tech.category === 'backend')).toHaveLength(7)
      expect(content.technologies.filter((tech) => tech.category === 'database')).toHaveLength(2)
      expect(content.technologies.filter((tech) => tech.category === 'devops')).toHaveLength(6)
      expect(content.contactChannels).toHaveLength(4)
      expect(content.profile.performance).toHaveLength(4)
    }
  })

  it('translates the English profile and project copy', () => {
    expect(enContent.profile.role).toBe('Frontend Web Developer')
    expect(enContent.projects[0]?.summary).not.toBe(esContent.projects[0]?.summary)
    expect(enContent.contactChannels[0]?.description).not.toBe(
      esContent.contactChannels[0]?.description,
    )
  })
})
