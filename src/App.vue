<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ChristmasSnowfall from '@/components/ui/ChristmasSnowfall.vue'
import { initPreferences } from '@/composables/usePreferences'
import { useSeo } from '@/composables/useSeo'
import { useI18n } from '@/i18n'

const route = useRoute()
const { t } = useI18n()

useSeo()

onMounted(() => {
  initPreferences()
})
</script>

<template>
  <div class="relative min-h-screen overflow-x-clip bg-background text-foreground/90">
    <ChristmasSnowfall />

    <a
      href="#main-content"
      class="sr-only z-100 rounded-md bg-cyan-accent px-4 py-2 font-mono text-xs font-bold text-accent-contrast focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {{ t('app.skipToContent') }}
    </a>

    <AppNavbar />

    <div
      class="christmas-decor pointer-events-none select-none absolute inset-x-0 top-18 z-0 h-7 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        class="h-full w-full"
        viewBox="0 0 1440 28"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
      >
        <path
          class="xmas-garland-cable"
          d="M0 6 C60 20 120 20 180 6 C240 20 300 20 360 6 C420 20 480 20 540 6 C600 20 660 20 720 6 C780 20 840 20 900 6 C960 20 1020 20 1080 6 C1140 20 1200 20 1260 6 C1320 20 1380 20 1440 6"
        />
        <g class="xmas-bulb xmas-bulb-a">
          <path d="M90 6v8" stroke="currentColor" stroke-width="1" />
          <circle class="xmas-bulb-halo" cx="90" cy="17" r="8" fill="currentColor" opacity="0.16" />
          <circle cx="90" cy="17" r="3.2" fill="currentColor" />
        </g>
        <g class="xmas-bulb xmas-bulb-b">
          <path d="M270 6v8" stroke="currentColor" stroke-width="1" />
          <circle class="xmas-bulb-halo" cx="270" cy="17" r="8" fill="currentColor" opacity="0.16" />
          <circle cx="270" cy="17" r="3.2" fill="currentColor" />
        </g>
        <g class="xmas-bulb xmas-bulb-a">
          <path d="M450 6v8" stroke="currentColor" stroke-width="1" />
          <circle class="xmas-bulb-halo" cx="450" cy="17" r="8" fill="currentColor" opacity="0.16" />
          <circle cx="450" cy="17" r="3.2" fill="currentColor" />
        </g>
        <g class="xmas-bulb xmas-bulb-b">
          <path d="M630 6v8" stroke="currentColor" stroke-width="1" />
          <circle class="xmas-bulb-halo" cx="630" cy="17" r="8" fill="currentColor" opacity="0.16" />
          <circle cx="630" cy="17" r="3.2" fill="currentColor" />
        </g>
        <g class="xmas-bulb xmas-bulb-a">
          <path d="M810 6v8" stroke="currentColor" stroke-width="1" />
          <circle class="xmas-bulb-halo" cx="810" cy="17" r="8" fill="currentColor" opacity="0.16" />
          <circle cx="810" cy="17" r="3.2" fill="currentColor" />
        </g>
        <g class="xmas-bulb xmas-bulb-b">
          <path d="M990 6v8" stroke="currentColor" stroke-width="1" />
          <circle class="xmas-bulb-halo" cx="990" cy="17" r="8" fill="currentColor" opacity="0.16" />
          <circle cx="990" cy="17" r="3.2" fill="currentColor" />
        </g>
        <g class="xmas-bulb xmas-bulb-a">
          <path d="M1170 6v8" stroke="currentColor" stroke-width="1" />
          <circle class="xmas-bulb-halo" cx="1170" cy="17" r="8" fill="currentColor" opacity="0.16" />
          <circle cx="1170" cy="17" r="3.2" fill="currentColor" />
        </g>
        <g class="xmas-bulb xmas-bulb-b">
          <path d="M1350 6v8" stroke="currentColor" stroke-width="1" />
          <circle class="xmas-bulb-halo" cx="1350" cy="17" r="8" fill="currentColor" opacity="0.16" />
          <circle cx="1350" cy="17" r="3.2" fill="currentColor" />
        </g>
      </svg>
    </div>

    <main id="main-content" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
  </div>
</template>
