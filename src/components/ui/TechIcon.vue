<script setup lang="ts">
import { computed } from 'vue'
import {
  siDocker,
  siExpress,
  siGit,
  siNestjs,
  siNodedotjs,
  siPinia,
  siPostgresql,
  siPrisma,
  siTailwindcss,
  siTypescript,
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
  node: siNodedotjs,
  express: siExpress,
  nestjs: siNestjs,
  postgresql: siPostgresql,
  prisma: siPrisma,
  docker: siDocker,
  git: siGit,
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
    role="img"
    :aria-label="iconData.title"
    class="shrink-0 transition-colors duration-300"
    :style="{ '--brand': brandColor }"
  >
    <path :d="iconData.path" />
  </svg>
</template>
