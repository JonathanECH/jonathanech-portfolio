import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useProjectSeo } from '@/composables/useProjectSeo'
import { projects } from '@/data/portfolio'

describe('useProjectSeo', () => {
  it('runs safely in a non-browser environment without throwing', () => {
    const project = ref(projects[0])
    expect(() => useProjectSeo(project)).not.toThrow()
  })

  it('updates document.title when document is available', () => {
    const fakeDoc = {
      title: '',
      querySelector: () => null,
    }

    // @ts-expect-error test mock
    globalThis.document = fakeDoc

    try {
      const project = ref(projects[0])
      useProjectSeo(project)

      expect(fakeDoc.title).toContain(projects[0].name)

      project.value = undefined as unknown as typeof projects[0]
      expect(fakeDoc.title).toBe('Jonathan Campos — Desarrollador Frontend')
    } finally {
      // @ts-expect-error cleanup
      delete globalThis.document
    }
  })
})
