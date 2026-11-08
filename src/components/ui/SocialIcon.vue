<script setup lang="ts">
import { computed } from 'vue'
import { Mail } from '@lucide/vue'
import { siGithub, siWhatsapp } from 'simple-icons'
import type { ContactIcon } from '@/types/portfolio'

const LINKEDIN_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z'

const props = withDefaults(
  defineProps<{
    name: ContactIcon
    size?: number
  }>(),
  {
    size: 20,
  },
)

const brand = computed(() => {
  if (props.name === 'mail') {
    return null
  }

  return {
    github: { title: 'GitHub', path: siGithub.path },
    linkedin: { title: 'LinkedIn', path: LINKEDIN_PATH },
    whatsapp: { title: 'WhatsApp', path: siWhatsapp.path },
  }[props.name]
})
</script>

<template>
  <Mail v-if="name === 'mail'" :size="size" aria-hidden="true" />
  <svg
    v-else-if="brand"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    class="shrink-0"
  >
    <path :d="brand.path" />
  </svg>
</template>
