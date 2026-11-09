<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import TechIcon from '@/components/ui/TechIcon.vue'
import { useI18n } from '@/i18n'
import type { Technology } from '@/types/portfolio'

const props = defineProps<{
  technology: Technology
  index: number
}>()

const { t } = useI18n()

const paddedIndex = computed(() => String(props.index + 1).padStart(2, '0'))

// iOS does not apply :active to non-interactive elements, so the tap feedback
// is driven by pointerdown and kept visible briefly after the touch ends.
const pressed = ref(false)
let pressTimer: number | undefined

function triggerTapFeedback(): void {
  pressed.value = true

  if (pressTimer !== undefined) {
    window.clearTimeout(pressTimer)
  }

  pressTimer = window.setTimeout(() => {
    pressed.value = false
  }, 280)
}

onBeforeUnmount(() => {
  if (pressTimer !== undefined) {
    window.clearTimeout(pressTimer)
  }
})
</script>

<template>
  <article
    role="listitem"
    class="reveal group relative flex h-full touch-manipulation select-none flex-col overflow-hidden rounded-xl border border-border bg-surface-card/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:bg-surface-card-hover hover:shadow-[0_0_30px_-8px_rgba(var(--ech-accent-rgb),0.35)] active:border-cyan-accent active:bg-cyan-accent/10"
    :style="
      pressed
        ? {
            borderColor: 'var(--ech-accent)',
            backgroundColor: 'rgba(var(--ech-accent-rgb), 0.1)',
            boxShadow: '0 0 26px -8px rgba(var(--ech-accent-rgb), 0.45)',
            transform: 'translateY(-1px) scale(0.99)',
          }
        : undefined
    "
    @pointerdown="triggerTapFeedback"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-accent/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    />

    <div class="flex items-start justify-between gap-3">
      <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-accent/70">
        {{ technology.label }}
      </span>

      <span class="transition-transform duration-300 group-hover:scale-110">
        <TechIcon
          :icon="technology.iconKey"
          :color="technology.brandColor"
          :size="24"
          class="text-muted transition-colors duration-300 group-hover:text-[var(--brand)]"
        />
      </span>
    </div>

    <h3
      class="mt-4 font-mono text-base font-bold tracking-wide text-foreground transition-colors duration-300 group-hover:text-cyan-accent"
    >
      {{ technology.name }}
    </h3>

    <div class="mt-auto flex items-end justify-between gap-3 pt-5">
      <ul class="flex flex-wrap gap-1.5" :aria-label="t('tech.specialtiesAria')">
        <li
          v-for="specialty in technology.specialties"
          :key="specialty"
          class="rounded border border-cyan-accent/15 bg-cyan-accent/5 px-1.5 py-0.5 font-mono text-[10px] leading-relaxed text-cyan-accent/80"
        >
          {{ specialty }}
        </li>
      </ul>

      <span
        class="shrink-0 font-mono text-[10px] tabular-nums text-muted/40 transition-colors duration-300 group-hover:text-muted/70"
        aria-hidden="true"
      >
        {{ paddedIndex }}
      </span>
    </div>
  </article>
</template>
