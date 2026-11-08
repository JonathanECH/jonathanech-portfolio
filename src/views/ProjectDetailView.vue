<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioData } from '@/composables/usePortfolioData'

const props = defineProps<{ slug: string }>()
const { getProjectBySlug } = usePortfolioData()
const project = computed(() => getProjectBySlug(props.slug))
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-24">
    <p class="font-mono text-xs text-cyan-accent">// PROJECT_DETAIL</p>
    <h1 class="mt-4 text-4xl font-bold text-white">{{ project?.name ?? 'Proyecto no encontrado' }}</h1>
  </div>
</template>
