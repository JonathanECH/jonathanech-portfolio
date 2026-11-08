<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types/portfolio'

const props = defineProps<{ project: Project }>()

interface SpecItem {
  readonly label: string
  readonly value: string
  readonly detail: string
}

const accentStyle = computed<Record<string, string>>(() => ({
  '--project-accent': props.project.accent,
}))

const specs = computed<readonly SpecItem[]>(() => [
  {
    label: 'ROL',
    value: props.project.role,
    detail: props.project.sector,
  },
  {
    label: 'CLIENTE',
    value: props.project.client,
    detail: `PROYECTO ${props.project.year}`,
  },
  {
    label: 'DURACIÓN',
    value: props.project.duration,
    detail: `STATUS // ${props.project.status}`,
  },
  {
    label: 'STACK',
    value: props.project.stackKey,
    detail: props.project.techTags.join(' • '),
  },
])
</script>

<template>
  <section
    class="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-12"
    aria-labelledby="project-specs-title"
    :style="accentStyle"
  >
    <h2 id="project-specs-title" class="sr-only">Especificaciones del proyecto</h2>

    <div
      class="grid grid-cols-1 gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-2 xl:grid-cols-4"
    >
      <div
        v-for="(spec, index) in specs"
        :key="spec.label"
        class="group relative flex flex-col justify-between gap-4 bg-surface p-5 transition-colors duration-300 hover:bg-surface-card sm:p-6"
      >
        <span
          class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--project-accent)]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />

        <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          <span class="text-[color:var(--project-accent)]/80">
            0{{ index + 1 }} //
          </span>
          {{ spec.label }}
        </p>

        <p class="text-sm font-semibold leading-snug text-white sm:text-[15px]">
          {{ spec.value }}
        </p>

        <p class="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-white/35">
          {{ spec.detail }}
        </p>
      </div>
    </div>
  </section>
</template>
