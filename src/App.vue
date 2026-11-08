<script setup lang="ts">
import { watchEffect } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useI18n } from '@/i18n'

const route = useRoute()
const { content, t } = useI18n()

watchEffect(() => {
  const name = route.name

  if (name === 'home') {
    document.title = t('meta.homeTitle')
  } else if (name === 'not-found') {
    document.title = t('meta.notFoundTitle')
  } else if (name === 'project-detail') {
    const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
    const project = content.value.projects.find((item) => item.slug === slug)

    document.title = project
      ? t('meta.projectTitle', { name: project.name })
      : t('meta.projectNotFoundTitle')
  }

  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')

  if (description) {
    description.content = t('meta.description')
  }
})
</script>

<template>
  <div class="relative min-h-screen overflow-x-clip bg-background text-white/90">
    <a
      href="#main-content"
      class="sr-only z-[100] rounded-md bg-cyan-accent px-4 py-2 font-mono text-xs font-bold text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {{ t('app.skipToContent') }}
    </a>

    <AppNavbar />

    <main id="main-content" class="pt-[72px]" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
  </div>
</template>
