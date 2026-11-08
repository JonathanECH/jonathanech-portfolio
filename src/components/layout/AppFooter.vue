<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/i18n'

const { content, t } = useI18n()

const footerLinks = computed(() =>
  content.value.contactChannels.filter((channel) =>
    ['github', 'linkedin', 'email'].includes(channel.id),
  ),
)
</script>

<template>
  <footer class="border-t border-border bg-surface/40">
    <div
      class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 font-mono text-[11px] text-muted sm:px-6 md:flex-row lg:px-12"
    >
      <p class="text-center md:text-left">
        © 2026 Jonathan Campos // Vue 3 • TypeScript • Tailwind CSS.
      </p>

      <nav
        class="flex items-center gap-4 uppercase tracking-[0.16em]"
        :aria-label="t('footer.ariaSocial')"
      >
        <template v-for="(link, index) in footerLinks" :key="link.id">
          <span v-if="index > 0" class="text-border" aria-hidden="true">//</span>
          <a
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            class="transition-colors hover:text-cyan-accent"
          >
            {{ link.id === 'email' ? 'EMAIL' : link.id === 'github' ? 'GITHUB' : 'LINKEDIN' }}
          </a>
        </template>
      </nav>
    </div>
  </footer>
</template>
