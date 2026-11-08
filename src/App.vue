<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useI18n } from '@/i18n'

const route = useRoute()
const { t } = useI18n()
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
