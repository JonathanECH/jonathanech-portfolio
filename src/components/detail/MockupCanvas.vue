<script setup lang="ts">
import { ref, watch } from 'vue'
import type { GallerySlide } from '@/types/portfolio'

const props = withDefaults(
  defineProps<{
    slide: GallerySlide
    priority?: boolean
  }>(),
  {
    priority: false,
  },
)

const imageFailed = ref(false)

watch(
  () => props.slide.image,
  () => {
    imageFailed.value = false
  },
)
</script>

<template>
  <div class="relative h-full w-full overflow-hidden bg-background">
    <img
      v-if="slide.image && !imageFailed"
      :src="slide.image"
      :alt="slide.alt ?? slide.title"
      width="1200"
      height="750"
      class="h-full w-full object-cover"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      decoding="async"
      @error="imageFailed = true"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center bg-grid-fine p-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted"
      role="img"
      :aria-label="slide.alt ?? slide.title"
    >
      {{ slide.title }}
    </div>
  </div>
</template>
