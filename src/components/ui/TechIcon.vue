<script setup lang="ts">
import { computed } from 'vue'
import {
  siAngular,
  siC,
  siCss,
  siDocker,
  siDotnet,
  siExpress,
  siGit,
  siGo,
  siHtml5,
  siJavascript,
  siNestjs,
  siNetlify,
  siNodedotjs,
  siPhp,
  siPinia,
  siPnpm,
  siPostgresql,
  siPostman,
  siPrisma,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVuedotjs,
} from 'simple-icons'
import type { TechIconKey } from '@/types/portfolio'

const props = withDefaults(
  defineProps<{
    icon: TechIconKey
    color?: string
    size?: number
  }>(),
  {
    color: undefined,
    size: 22,
  },
)

const iconMap = {
  vue: siVuedotjs,
  typescript: siTypescript,
  tailwind: siTailwindcss,
  pinia: siPinia,
  angular: siAngular,
  html: siHtml5,
  css: siCss,
  javascript: siJavascript,
  node: siNodedotjs,
  express: siExpress,
  nestjs: siNestjs,
  go: siGo,
  php: siPhp,
  c: siC,
  csharp: siDotnet,
  postgresql: siPostgresql,
  prisma: siPrisma,
  docker: siDocker,
  git: siGit,
  pnpm: siPnpm,
  postman: siPostman,
  vercel: siVercel,
  netlify: siNetlify,
} as const

const iconData = computed(() => iconMap[props.icon])
const brandColor = computed(() => props.color ?? `#${iconData.value.hex}`)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    class="shrink-0 transition-colors duration-300"
    :style="{ '--brand': brandColor }"
  >
    <path :d="iconData.path" />
  </svg>
</template>
